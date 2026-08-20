import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Production-Ready API Constants
class ApiConstants {
  // 1. Private constructor to prevent accidental instantiation of this class
  ApiConstants._();

  // 2. Define Environments
  static const String _prodBaseUrl = 'https://fixitfirst.onrender.com/api';
  static const String _devEmulatorUrl = 'http://10.0.2.2:5000/api';

  static String _customDevIp = '';

  // 3. Environment-Aware Base URL Getter
  static String get baseUrl {
    if (kReleaseMode) {
      return _prodBaseUrl;
    }

    // --- Dev/Debug Mode Logic Below ---
    if (_customDevIp.isNotEmpty) {
      if (_customDevIp.startsWith('http://') || _customDevIp.startsWith('https://')) {
        return _customDevIp.endsWith('/api') ? _customDevIp : '$_customDevIp/api';
      }
      return 'http://$_customDevIp:5000/api';
    }

    // Default to production live backend server (Render)
    return _prodBaseUrl;
  }

  static String get customIp => _customDevIp;
  static String get emulatorBaseUrl => _devEmulatorUrl;

  // --- Dev Tools (Disabled in Production) ---

  static Future<void> loadCustomIp() async {
    // Security check: Stop running this code in the live Play Store app
    if (kReleaseMode) return; 

    try {
      final prefs = await SharedPreferences.getInstance();
      final savedIp = prefs.getString('custom_server_ip');

      if (savedIp != null && savedIp.isNotEmpty) {
        // Clear known legacy IPs and port 5000 overrides
        if (savedIp.contains('10.206.75.58') || savedIp.contains('10.250.185.62') || savedIp.contains(':5000')) {
          await prefs.remove('custom_server_ip');
          _customDevIp = '';
        } else {
          _customDevIp = savedIp;
        }
      }
    } catch (e) {
      debugPrint('Failed to load custom IP: $e');
    }
  }

  static Future<void> setCustomIp(String ip) async {
    if (kReleaseMode) return; // Prevent IP override in production

    final trimmed = ip.trim();
    final prefs = await SharedPreferences.getInstance();

    if (trimmed.isEmpty || trimmed.contains('10.206.75.58') || trimmed.contains('10.250.185.62')) {
      _customDevIp = '';
      await prefs.remove('custom_server_ip');
    } else {
      _customDevIp = trimmed;
      await prefs.setString('custom_server_ip', _customDevIp);
    }
  }

  static Future<void> clearCustomIp() => setCustomIp('');

  // --- API Endpoints ---
  
  // Auth
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String profile = '/auth/profile';

  // Categories
  static const String categories = '/categories';

  // Services
  static const String services = '/services';
  static String servicesByCategory(String categoryId) => '/services/category/$categoryId';

  // Bookings
  static const String bookings = '/bookings';
}