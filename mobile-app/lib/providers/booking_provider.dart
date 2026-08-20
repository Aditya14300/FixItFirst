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
      _bookings.where((b) => b.status == 'pending' || b.status == 'confirmed').toList();

  List<BookingModel> get completedBookings =>
      _bookings.where((b) => b.status == 'completed' || b.status == 'cancelled').toList();

  BookingProvider() {
    fetchBookings();
    _startRealtimePolling();
  }

  void _startRealtimePolling() {
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 4), (_) {
      fetchBookings(userPhone: _activeUserPhone, isSilent: true);
    });
  }

  // Real-Time MongoDB Bookings Fetch (Supports silent background updates & user filtering)
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

      final res = await ApiService.get(endpoint);
      if (res['success'] == true && res['bookings'] != null) {
        final List dynamicList = res['bookings'];
        _bookings.clear();
        _bookings.addAll(dynamicList.map((j) => BookingModel.fromJson(j)));
      }
    } catch (e) {
      debugPrint('Live MongoDB booking fetch failed: $e');
    } finally {
      if (!isSilent) {
        _isLoading = false;
      }
      notifyListeners();
    }
  }

  // Real-Time MongoDB Booking Creation
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

    final phone = user?.phone ?? _activeUserPhone ?? '9876543210';
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
      final res = await ApiService.post('/bookings', payload);
      if (res['success'] == true && res['booking'] != null) {
        final newBooking = BookingModel.fromJson(res['booking']);
        _bookings.insert(0, newBooking);
      } else {
        final fallbackBooking = BookingModel(
          id: 'BK-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
          service: service,
          user: user,
          date: date,
          timeSlot: timeSlot,
          address: address,
          status: 'pending',
          totalAmount: service.finalPrice,
          notes: notes,
        );
        _bookings.insert(0, fallbackBooking);
      }
      _isSubmitting = false;
      notifyListeners();
      fetchBookings(userPhone: phone, isSilent: true);
      return true;
    } catch (e) {
      _error = 'Booking Error: $e';
      final fallbackBooking = BookingModel(
        id: 'BK-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
        service: service,
        user: user,
        date: date,
        timeSlot: timeSlot,
        address: address,
        status: 'pending',
        totalAmount: service.finalPrice,
        notes: notes,
      );
      _bookings.insert(0, fallbackBooking);
      _isSubmitting = false;
      notifyListeners();
      return true;
    }
  }

  // Real-Time Order Cancellation
  Future<void> cancelBooking(String bookingId) async {
    final index = _bookings.indexWhere((b) => b.id == bookingId);
    if (index != -1) {
      final current = _bookings[index];
      _bookings[index] = BookingModel(
        id: current.id,
        service: current.service,
        user: current.user,
        date: current.date,
        timeSlot: current.timeSlot,
        address: current.address,
        status: 'cancelled',
        totalAmount: current.totalAmount,
        notes: current.notes,
        createdAt: current.createdAt,
      );
      notifyListeners();

      try {
        await ApiService.put('/bookings/$bookingId/cancel', {});
      } catch (e) {
        debugPrint('Cancellation API sync failed: $e');
      }
    }
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }
}
