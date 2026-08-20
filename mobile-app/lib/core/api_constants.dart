import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiConstants {
  static const String liveBaseUrl = 'https://fixitfirst.onrender.com/api';
  static String _customIp = '';

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

  // Base URL pointing to deployed Render backend by default
  static String get baseUrl {
    if (_customIp.isNotEmpty) {
      if (_customIp.startsWith('http://') || _customIp.startsWith('https://')) {
        return _customIp.endsWith('/api') ? _customIp : '$_customIp/api';
      }
      return 'http://$_customIp:5000/api';
    }
    return liveBaseUrl;
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
