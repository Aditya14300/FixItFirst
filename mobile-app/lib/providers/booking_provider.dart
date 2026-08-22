import 'dart:async';
import 'package:flutter/material.dart';
import '../models/booking_model.dart';
import '../models/service_model.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class BookingProvider extends ChangeNotifier {
  final List<BookingModel> _bookings = [];
  bool _isLoading = false;
  bool _isSubmitting = false;
  String? _error;
  Timer? _pollingTimer;
  String? _activeUserPhone;

  List<BookingModel> get bookings => List.unmodifiable(_bookings);
  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  String? get error => _error;

  List<BookingModel> get activeBookings =>
      _bookings.where((b) => b.status.toLowerCase() == 'pending' || b.status.toLowerCase() == 'confirmed').toList();

  List<BookingModel> get completedBookings =>
      _bookings.where((b) => b.status.toLowerCase() == 'completed' || b.status.toLowerCase() == 'cancelled').toList();

  BookingProvider() {
    fetchBookings();
    _startRealtimePolling();
  }

  void _startRealtimePolling() {
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 8), (_) {
      fetchBookings(userPhone: _activeUserPhone, isSilent: true);
    });
  }

  // Real-Time MongoDB Bookings Fetch (Strictly live data from MongoDB)
  Future<void> fetchBookings({String? userPhone, bool isSilent = false}) async {
    if (userPhone != null && userPhone.isNotEmpty) {
      _activeUserPhone = userPhone;
    }

    if (!isSilent) {
      _isLoading = true;
      _error = null;
      notifyListeners();
    }

    try {
      final endpoint = (_activeUserPhone != null && _activeUserPhone!.isNotEmpty)
          ? '/bookings?phone=$_activeUserPhone'
          : '/bookings';

      final res = await ApiService.get(endpoint, requireAuth: true);
      if (res != null && (res['success'] == true || res['bookings'] != null)) {
        final List dynamicList = res['bookings'] ?? (res is List ? res : []);
        _bookings.clear();
        _bookings.addAll(dynamicList.map((j) => BookingModel.fromJson(j)));
        _error = null;
      } else {
        _bookings.clear();
      }
    } on ApiException catch (e) {
      if (!isSilent) _error = e.message;
      debugPrint('Booking fetch error: ${e.message}');
    } catch (e) {
      debugPrint('Live MongoDB booking fetch failed: $e');
    } finally {
      if (!isSilent) {
        _isLoading = false;
      }
      notifyListeners();
    }
  }

  // Real-Time MongoDB Booking Creation (Strictly live backend API)
  Future<bool> createBooking({
    required ServiceModel service,
    required UserModel? user,
    required String date,
    required String timeSlot,
    required String address,
    String notes = '',
  }) async {
    _isSubmitting = true;
    _error = null;
    notifyListeners();

    final phone = user?.phone ?? _activeUserPhone;
    if (phone == null || phone.isEmpty) {
      _error = 'Please log in to book a service.';
      _isSubmitting = false;
      notifyListeners();
      return false;
    }

    _activeUserPhone = phone;

    final payload = {
      'customerName': user?.name ?? 'Customer',
      'customerPhone': phone,
      'serviceName': service.name,
      'date': date,
      'timeSlot': timeSlot,
      'address': address,
      'amount': service.finalPrice,
      'notes': notes,
    };

    try {
      final res = await ApiService.post('/bookings', payload, requireAuth: true);
      if (res != null && (res['success'] == true || res['booking'] != null)) {
        final bookingMap = res['booking'] ?? res;
        final newBooking = BookingModel.fromJson(bookingMap);
        _bookings.insert(0, newBooking);
        _isSubmitting = false;
        notifyListeners();
        fetchBookings(userPhone: phone, isSilent: true);
        return true;
      } else {
        _error = res?['message'] ?? 'Failed to create booking on backend.';
        _isSubmitting = false;
        notifyListeners();
        return false;
      }
    } on ApiException catch (e) {
      _error = e.message;
      _isSubmitting = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = 'Booking failed: ${e.toString().replaceAll('Exception: ', '')}';
      _isSubmitting = false;
      notifyListeners();
      return false;
    }
  }

  // Real-Time Order Cancellation with Reason (Strictly live backend API)
  Future<bool> cancelBooking(String bookingId, {String reason = 'Cancelled by user'}) async {
    try {
      final res = await ApiService.put('/bookings/$bookingId/cancel', {
        'reason': reason,
        'cancellationReason': reason,
      }, requireAuth: true);

      if (res != null && res['booking'] != null) {
        final updated = BookingModel.fromJson(res['booking']);
        final index = _bookings.indexWhere((b) => b.id == bookingId);
        if (index != -1) {
          _bookings[index] = updated;
          notifyListeners();
        }
      }
      fetchBookings(userPhone: _activeUserPhone, isSilent: true);
      return true;
    } catch (e) {
      debugPrint('Cancellation API sync failed: $e');
      return false;
    }
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }
}
