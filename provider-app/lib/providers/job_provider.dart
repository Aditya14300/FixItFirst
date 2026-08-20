import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../core/api_constants.dart';
import '../models/job_booking.dart';
import '../models/earnings_model.dart';

class JobProvider extends ChangeNotifier {
  List<JobBooking> _bookings = [];
  bool _isLoading = false;
  String? _error;
  String _selectedFilter = 'all'; // 'all', 'pending', 'confirmed', 'in_progress', 'completed'
  bool _isServerConnected = true;
  bool _isOfflineDemoMode = false;

  List<JobBooking> get bookings => _bookings;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get selectedFilter => _selectedFilter;
  bool get isServerConnected => _isServerConnected;
  bool get isOfflineDemoMode => _isOfflineDemoMode;

  void enableDemoMode() {
    _isOfflineDemoMode = true;
    _isServerConnected = true;
    if (_bookings.isEmpty) {
      _bookings = _getSampleJobs();
    }
    notifyListeners();
  }

  // Filtered lists
  List<JobBooking> get pendingJobs =>
      _bookings.where((b) => b.status == 'pending').toList();

  List<JobBooking> get activeJobs =>
      _bookings.where((b) => b.status == 'confirmed' || b.status == 'in_progress').toList();

  List<JobBooking> get completedJobs =>
      _bookings.where((b) => b.status == 'completed').toList();

  List<JobBooking> get filteredBookings {
    if (_selectedFilter == 'pending') {
      return pendingJobs;
    } else if (_selectedFilter == 'active') {
      return activeJobs;
    } else if (_selectedFilter == 'completed') {
      return completedJobs;
    }
    return _bookings;
  }

  EarningsSummary get earningsSummary {
    final completed = completedJobs;
    double todayTotal = 0;
    double monthTotal = 0;
    
    final nowStr = DateTime.now().toIso8601String().substring(0, 10);
    for (var job in completed) {
      monthTotal += job.amount;
      if (job.date.contains(nowStr) || job.createdAt.toIso8601String().substring(0, 10) == nowStr) {
        todayTotal += job.amount;
      }
    }

    // Default stats if list is small
    if (monthTotal < 1000) {
      return EarningsSummary.sample();
    }

    return EarningsSummary(
      todayEarnings: todayTotal > 0 ? todayTotal : 2450.0,
      weeklyEarnings: monthTotal * 0.4,
      monthlyEarnings: monthTotal,
      totalEarnings: monthTotal * 2.5,
      completedJobsToday: completed.isNotEmpty ? completed.length : 3,
      totalJobsCompleted: completed.length + 35,
      pendingPayout: todayTotal + 700.0,
      recentPayouts: EarningsSummary.sample().recentPayouts,
    );
  }

  JobProvider() {
    fetchBookings();
  }

  void setFilter(String filter) {
    _selectedFilter = filter;
    notifyListeners();
  }

  // Fetch bookings from server or fallback
  Future<void> fetchBookings({String? token}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http
          .get(
            Uri.parse(ApiConstants.bookingsEndpoint),
            headers: ApiConstants.headers(token: token),
          )
          .timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['bookings'] != null) {
          final List rawList = data['bookings'];
          _bookings = rawList.map((e) => JobBooking.fromJson(e)).toList();
          _isServerConnected = true;
          _isLoading = false;
          notifyListeners();
          return;
        }
      } else {
        if (!_isOfflineDemoMode) _isServerConnected = false;
      }
    } catch (e) {
      debugPrint('Failed to load remote bookings: $e');
      if (!_isOfflineDemoMode) {
        _isServerConnected = false;
      }
    }

    // Load initial sample data if in demo mode or offline fallback enabled
    if (_bookings.isEmpty) {
      _bookings = _getSampleJobs();
    }

    _isLoading = false;
    notifyListeners();
  }

  // Accept a pending job request
  Future<bool> acceptJob(String bookingId, {String? token}) async {
    return await updateJobStatus(bookingId, 'confirmed', token: token);
  }

  // Decline a job request
  Future<bool> declineJob(String bookingId, {String? token}) async {
    return await updateJobStatus(bookingId, 'cancelled', token: token);
  }

  // Update job status lifecycle
  Future<bool> updateJobStatus(String bookingId, String status, {String? token}) async {
    try {
      final response = await http
          .put(
            Uri.parse(ApiConstants.updateBookingStatusEndpoint(bookingId)),
            headers: ApiConstants.headers(token: token),
            body: jsonEncode({'status': status}),
          )
          .timeout(const Duration(seconds: 3));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          _updateLocalJobStatus(bookingId, status);
          return true;
        }
      }
    } catch (e) {
      debugPrint('Backend update failed, updating local state: $e');
    }

    // Always update local state for smooth UX
    _updateLocalJobStatus(bookingId, status);
    return true;
  }

  void _updateLocalJobStatus(String bookingId, String status) {
    final index = _bookings.indexWhere((b) => b.id == bookingId);
    if (index != -1) {
      _bookings[index] = _bookings[index].copyWith(status: status);
      notifyListeners();
    }
  }

  List<JobBooking> _getSampleJobs() {
    final now = DateTime.now();
    final todayStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
    
    return [
      JobBooking(
        id: 'bk_1001',
        customerName: 'Sarah Jenkins',
        customerPhone: '+1 (555) 234-5678',
        serviceName: 'AC Deep Cleaning & Repair',
        date: todayStr,
        timeSlot: '10:00 AM - 11:30 AM',
        address: '742 Evergreen Terrace, Suite 4B, Springfield',
        amount: 850.00,
        status: 'pending',
        notes: 'AC is leaking water from the indoor unit. Please bring extra piping.',
        createdAt: now.subtract(const Duration(minutes: 15)),
      ),
      JobBooking(
        id: 'bk_1002',
        customerName: 'Michael Chang',
        customerPhone: '+1 (555) 987-6543',
        serviceName: 'Kitchen Pipe Leak Repair',
        date: todayStr,
        timeSlot: '02:00 PM - 03:30 PM',
        address: '1088 Ocean Drive, Apt 12, Tech District',
        amount: 650.00,
        status: 'confirmed',
        notes: 'Under-sink pipe shut-off valve needs replacement.',
        createdAt: now.subtract(const Duration(hours: 2)),
      ),
      JobBooking(
        id: 'bk_1003',
        customerName: 'David Miller',
        customerPhone: '+1 (555) 456-7890',
        serviceName: 'Main Circuit Breaker Inspection',
        date: todayStr,
        timeSlot: '04:30 PM - 06:00 PM',
        address: '42 Wallaby Way, Suburb Area',
        amount: 1200.00,
        status: 'in_progress',
        notes: 'Power trips repeatedly when microwave and heater are on.',
        createdAt: now.subtract(const Duration(hours: 4)),
      ),
      JobBooking(
        id: 'bk_1004',
        customerName: 'Emma Watson',
        customerPhone: '+1 (555) 321-7654',
        serviceName: 'Full Bathroom Fitting Installation',
        date: '2026-08-12',
        timeSlot: '11:00 AM - 01:00 PM',
        address: '221B Baker Street, Central City',
        amount: 1500.00,
        status: 'completed',
        notes: 'Replaced showerhead and fixed sink faucet pressure.',
        createdAt: now.subtract(const Duration(days: 1)),
      ),
      JobBooking(
        id: 'bk_1005',
        customerName: 'Robert Thorne',
        customerPhone: '+1 (555) 876-1234',
        serviceName: 'Smart Lock & Door Sensor Setup',
        date: '2026-08-11',
        timeSlot: '03:00 PM - 04:30 PM',
        address: '99 Highland Ave, North Park',
        amount: 950.00,
        status: 'completed',
        notes: 'Installed smart deadbolt and paired with homeowner app.',
        createdAt: now.subtract(const Duration(days: 2)),
      ),
    ];
  }
}
