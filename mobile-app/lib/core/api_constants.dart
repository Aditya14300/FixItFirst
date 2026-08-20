import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiConstants {
  static String _customIp = '10.250.185.62'; // PC Local Wi-Fi IP for Physical Android Phone / Network

  static Future<void> loadCustomIp() async {
    final prefs = await SharedPreferences.getInstance();
    final savedIp = prefs.getString('custom_server_ip');
    if (savedIp != null && savedIp.isNotEmpty) {
      _customIp = savedIp;
    }
  }

  static Future<void> setCustomIp(String ip) async {
    _customIp = ip.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('custom_server_ip', _customIp);
  }

  static String get customIp => _customIp;

  // Dynamically resolve localhost vs local IP vs Android Emulator
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    } else if (Platform.isAndroid) {
      // Use configured IP for Physical Android Phone (10.206.75.58)
      return 'http://$_customIp:5000/api';
    } else {
      return 'http://localhost:5000/api';
    }
  }

  // Backup URL for Emulator
  static String get emulatorBaseUrl => 'http://10.0.2.2:5000/api';

  // Auth Endpoints
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String profile = '/auth/profile';

  // Category Endpoints
  static const String categories = '/categories';

  // Service Endpoints
  static const String services = '/services';
  static String servicesByCategory(String categoryId) => '/services/category/$categoryId';

  // Booking Endpoints
  static const String bookings = '/bookings';
}
