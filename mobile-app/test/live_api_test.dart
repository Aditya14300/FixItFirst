import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fixitfirst_mobile/core/api_constants.dart';
import 'package:fixitfirst_mobile/services/api_service.dart';
import 'package:fixitfirst_mobile/models/user_model.dart';
import 'package:fixitfirst_mobile/models/category_model.dart';
import 'package:fixitfirst_mobile/models/service_model.dart';
import 'package:fixitfirst_mobile/models/booking_model.dart';

class RealHttpOverrides extends HttpOverrides {}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  HttpOverrides.global = RealHttpOverrides();

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
  });

  Map<String, String> getTestHeaders({String? token}) {
    final map = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      map['Authorization'] = 'Bearer $token';
    }
    return map;
  }

  test('Live API End-to-End Test Suite against Render Backend', () async {
    print('\n==================================================');
    print('Starting Live API End-to-End Tests against Render');
    print('Target Base URL: ${ApiConstants.baseUrl}');
    print('==================================================\n');

    final client = http.Client();

    // 1. PING ROOT
    print('[TEST 1] Pinging Render Backend...');
    try {
      final res = await client.get(
        Uri.parse('https://fixitfirst.onrender.com/'),
        headers: getTestHeaders(),
      ).timeout(const Duration(seconds: 60));
      print('  Status: ${res.statusCode}');
      print('  Body: ${res.body}');
    } catch (e) {
      print('  Error: $e');
    }

    // 2. AUTHENTICATION - REGISTER
    final ts = DateTime.now().millisecondsSinceEpoch.toString();
    final testPhone = '99${ts.substring(ts.length - 8)}';
    final testName = 'Test User ${ts.substring(ts.length - 4)}';
    final testEmail = 'test$ts@example.com';
    final testPassword = 'Password123!';

    print('\n[TEST 2] Auth - Register ($testPhone)...');
    try {
      final res = await client.post(
        Uri.parse('${ApiConstants.baseUrl}/auth/register'),
        headers: getTestHeaders(),
        body: jsonEncode({
          'name': testName,
          'phone': testPhone,
          'email': testEmail,
          'password': testPassword,
        }),
      ).timeout(const Duration(seconds: 30));
      print('  Status: ${res.statusCode}');
      print('  Body: ${res.body}');
    } catch (e) {
      print('  Error: $e');
    }

    // 3. AUTHENTICATION - LOGIN
    print('\n[TEST 3] Auth - Login ($testPhone)...');
    String? token;
    try {
      final res = await client.post(
        Uri.parse('${ApiConstants.baseUrl}/auth/login'),
        headers: getTestHeaders(),
        body: jsonEncode({
          'phone': testPhone,
          'password': testPassword,
        }),
      ).timeout(const Duration(seconds: 30));
      print('  Status: ${res.statusCode}');
      print('  Body: ${res.body}');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        token = data['token'];
        if (data['user'] != null) {
          final userObj = UserModel.fromJson(Map<String, dynamic>.from(data['user']));
          print('  UserModel parsed successfully: ID=${userObj.id}, Name=${userObj.name}');
        }
      }
    } catch (e) {
      print('  Error: $e');
    }

    // 4. DATA FETCHING - CATEGORIES
    print('\n[TEST 4] Data Fetching - Categories...');
    try {
      final res = await client.get(
        Uri.parse('${ApiConstants.baseUrl}/categories'),
        headers: getTestHeaders(),
      ).timeout(const Duration(seconds: 30));
      print('  Status: ${res.statusCode}');
      print('  Body: ${res.body}');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final List list = data['categories'] ?? (data is List ? data : []);
        final categories = list.map((c) => CategoryModel.fromJson(Map<String, dynamic>.from(c))).toList();
        print('  CategoryModel Parsed: ${categories.length} items');
      }
    } catch (e) {
      print('  Error: $e');
    }

    // 5. DATA FETCHING - SERVICES
    print('\n[TEST 5] Data Fetching - Services...');
    try {
      final res = await client.get(
        Uri.parse('${ApiConstants.baseUrl}/services'),
        headers: getTestHeaders(),
      ).timeout(const Duration(seconds: 30));
      print('  Status: ${res.statusCode}');
      print('  Body: ${res.body}');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final List list = data['services'] ?? (data is List ? data : []);
        final services = list.map((s) => ServiceModel.fromJson(Map<String, dynamic>.from(s))).toList();
        print('  ServiceModel Parsed: ${services.length} items');
      }
    } catch (e) {
      print('  Error: $e');
    }

    // 6. TRANSACTIONS - CREATE BOOKING
    print('\n[TEST 6] Transactions - Create Booking...');
    String? createdBookingId;
    try {
      final res = await client.post(
        Uri.parse('${ApiConstants.baseUrl}/bookings'),
        headers: getTestHeaders(token: token),
        body: jsonEncode({
          'customerName': testName,
          'customerPhone': testPhone,
          'serviceName': 'AC Deep Service',
          'date': '2026-08-25',
          'timeSlot': '10:00 AM',
          'address': '123 Test Street, Test City',
          'amount': 799,
          'notes': 'Live API Test',
        }),
      ).timeout(const Duration(seconds: 30));
      print('  Status: ${res.statusCode}');
      print('  Body: ${res.body}');
      if (res.statusCode >= 200 && res.statusCode < 300) {
        final data = jsonDecode(res.body);
        final bookingData = data['booking'] ?? data;
        if (bookingData is Map) {
          final bookingObj = BookingModel.fromJson(Map<String, dynamic>.from(bookingData));
          createdBookingId = bookingObj.id;
          print('  BookingModel Parsed: ID=$createdBookingId, Service=${bookingObj.service.name}');
        }
      }
    } catch (e) {
      print('  Error: $e');
    }

    // 7. TRANSACTIONS - FETCH BOOKINGS
    print('\n[TEST 7] Transactions - Fetch Bookings...');
    try {
      final res = await client.get(
        Uri.parse('${ApiConstants.baseUrl}/bookings?phone=$testPhone'),
        headers: getTestHeaders(token: token),
      ).timeout(const Duration(seconds: 30));
      print('  Status: ${res.statusCode}');
      print('  Body: ${res.body}');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final List list = data['bookings'] ?? (data is List ? data : []);
        final bookings = list.map((b) => BookingModel.fromJson(Map<String, dynamic>.from(b))).toList();
        print('  Fetch Bookings Parsed: ${bookings.length} items');
      }
    } catch (e) {
      print('  Error: $e');
    }

    // 8. TRANSACTIONS - CANCEL BOOKING
    if (createdBookingId != null && createdBookingId.isNotEmpty) {
      print('\n[TEST 8] Transactions - Cancel Booking ($createdBookingId)...');
      try {
        final res = await client.put(
          Uri.parse('${ApiConstants.baseUrl}/bookings/$createdBookingId/cancel'),
          headers: getTestHeaders(token: token),
          body: jsonEncode({}),
        ).timeout(const Duration(seconds: 30));
        print('  Status: ${res.statusCode}');
        print('  Body: ${res.body}');
      } catch (e) {
        print('  Error: $e');
      }
    }

    client.close();
    print('\n==================================================');
    print('Live API Test Execution Finished');
    print('==================================================\n');
  }, timeout: const Timeout(Duration(minutes: 3)));
}
