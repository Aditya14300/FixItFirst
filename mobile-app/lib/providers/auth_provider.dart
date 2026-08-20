import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api_constants.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  String? _token;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  String? get token => _token;
  bool get isAuthenticated => _token != null && _user != null;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _loadStoredSession();
  }

  Future<void> _loadStoredSession() async {
    await ApiConstants.loadCustomIp();
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    
    final storedName = prefs.getString('user_name');
    final storedPhone = prefs.getString('user_phone');
    final storedEmail = prefs.getString('user_email');
    final storedRole = prefs.getString('user_role');

    if (_token != null && storedName != null) {
      _user = UserModel(
        id: 'user-${DateTime.now().millisecondsSinceEpoch}',
        name: storedName,
        email: storedEmail ?? 'user@fixitfirst.com',
        phone: storedPhone ?? '9876543210',
        role: storedRole ?? 'customer',
      );
      notifyListeners();
    }
  }

  Future<bool> login(String phone, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await ApiService.post(
        ApiConstants.login,
        {
          'phone': phone,
          'password': password,
        },
      );

      if (response['success'] == true) {
        _token = response['token'];
        _user = UserModel.fromJson(response['user']);

        await _saveUserSession(_token!, _user!);

        _setLoading(false);
        return true;
      } else {
        _setError(response['message'] ?? 'Login failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      // Catch network connection error & provide fallback demo login
      final cleanMsg = e.toString().replaceAll('Exception: ', '');
      _setError(cleanMsg);
      _setLoading(false);
      return false;
    }
  }

  Future<bool> loginAsDemoUser({String name = 'Demo User', String phone = '9876543210'}) async {
    _setLoading(true);
    _clearError();

    await Future.delayed(const Duration(milliseconds: 600));

    _token = 'demo-token-${DateTime.now().millisecondsSinceEpoch}';
    _user = UserModel(
      id: 'demo-101',
      name: name,
      email: 'demo@fixitfirst.com',
      phone: phone,
      role: 'customer',
      isVerified: true,
    );

    await _saveUserSession(_token!, _user!);

    _setLoading(false);
    return true;
  }

  Future<bool> register({
    required String name,
    required String phone,
    required String email,
    required String password,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final body = <String, dynamic>{
        'name': name.trim(),
        'phone': phone.trim(),
        'password': password,
      };

      if (email.trim().isNotEmpty) {
        body['email'] = email.trim();
      }

      final response = await ApiService.post(
        ApiConstants.register,
        body,
      );

      if (response != null && response['success'] == true) {
        // Automatically perform real login to obtain JWT token & user session from database
        return await login(phone.trim(), password);
      } else {
        _setError(response?['message'] ?? 'Registration failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      final cleanMsg = e.toString().replaceAll('Exception: ', '');
      debugPrint('Registration API Error: $cleanMsg');
      _setError(cleanMsg);
      _setLoading(false);
      return false;
    }
  }

  Future<void> _saveUserSession(String tokenStr, UserModel userObj) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', tokenStr);
    await prefs.setString('user_name', userObj.name);
    await prefs.setString('user_phone', userObj.phone);
    await prefs.setString('user_email', userObj.email);
    await prefs.setString('user_role', userObj.role);
    notifyListeners();
  }

  Future<void> logout() async {
    _user = null;
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String msg) {
    _errorMessage = msg;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
  }
}
