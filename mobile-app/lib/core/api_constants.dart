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
      // Clear legacy/old local IP overrides so the app uses live production Render URL
      if (savedIp.contains('10.206.75.58') || savedIp.contains('10.250.185.62') || savedIp.contains(':5000')) {
        await prefs.remove('custom_server_ip');
        _customIp = '';
      } else {
        _customIp = savedIp;
      }
    }
  }

  static Future<void> resetCustomIp() async {
    _customIp = '';
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('custom_server_ip');
  }

  static Future<void> setCustomIp(String ip) async {
    final trimmed = ip.trim();
    if (trimmed.isEmpty || trimmed.contains('10.206.75.58') || trimmed.contains('10.250.185.62')) {
      await resetCustomIp();
    } else {
      _customIp = trimmed;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('custom_server_ip', _customIp);
    }
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
