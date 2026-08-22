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
  bool get isDemoUser => _token != null && (_token!.startsWith('demo-token') || _user?.id == 'demo-101');
  bool get isRealUser => isAuthenticated && !isDemoUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _loadStoredSession();
  }

  Future<void> _loadStoredSession() async {
    await ApiConstants.loadCustomIp();
    _token = await ApiService.getToken();

    final prefs = await SharedPreferences.getInstance();
    final storedName = prefs.getString('user_name');
    final storedPhone = prefs.getString('user_phone');
    final storedEmail = prefs.getString('user_email');
    final storedRole = prefs.getString('user_role');
    final storedId = prefs.getString('user_id');

    if (_token != null && _token!.isNotEmpty && storedName != null) {
      _user = UserModel(
        id: storedId ?? 'user-${DateTime.now().millisecondsSinceEpoch}',
        name: storedName,
        email: storedEmail ?? '',
        phone: storedPhone ?? '',
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
          'phone': phone.trim(),
          'password': password,
        },
        requireAuth: false,
      );

      if (response != null && (response['success'] == true || response['token'] != null)) {
        _token = response['token'] ?? 'token-${DateTime.now().millisecondsSinceEpoch}';
        
        if (response['user'] != null) {
          _user = UserModel.fromJson(Map<String, dynamic>.from(response['user']));
        } else {
          _user = UserModel(
            id: (response['_id'] ?? response['id'] ?? 'user-${DateTime.now().millisecondsSinceEpoch}').toString(),
            name: response['name'] ?? 'User',
            email: response['email'] ?? '',
            phone: phone.trim(),
            role: response['role'] ?? 'customer',
          );
        }

        await ApiService.saveToken(_token!);
        await _saveUserSession(_token!, _user!);

        _setLoading(false);
        return true;
      } else {
        final serverMsg = response?['message'] ?? response?['error'] ?? 'Login failed. Please verify credentials.';
        _setError(serverMsg);
        _setLoading(false);
        return false;
      }
    } on ApiException catch (e) {
      _setError(e.message);
      _setLoading(false);
      return false;
    } catch (e) {
      _setError('Login failed: ${e.toString().replaceAll('Exception: ', '')}');
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

    await ApiService.saveToken(_token!);
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
        requireAuth: false,
      );

      if (response != null && (response['success'] == true || response['token'] != null || response['user'] != null)) {
        // If backend directly returns user session & token upon registration
        if (response['token'] != null) {
          _token = response['token'];
          if (response['user'] != null) {
            _user = UserModel.fromJson(response['user']);
          } else {
            _user = UserModel(
              id: response['_id'] ?? response['id'] ?? 'user-${DateTime.now().millisecondsSinceEpoch}',
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              role: 'customer',
            );
          }
          await ApiService.saveToken(_token!);
          await _saveUserSession(_token!, _user!);
          _setLoading(false);
          return true;
        }

        // Auto-login to obtain session if registration succeeds
        return await login(phone.trim(), password);
      } else {
        final serverMsg = response?['message'] ?? response?['error'] ?? 'Registration failed.';
        _setError(serverMsg);
        _setLoading(false);
        return false;
      }
    } on ApiException catch (e) {
      _setError(e.message);
      _setLoading(false);
      return false;
    } catch (e) {
      _setError(e.toString().replaceAll('Exception: ', ''));
      _setLoading(false);
      return false;
    }
  }

  Future<void> _saveUserSession(String tokenStr, UserModel userObj) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', tokenStr);
    await prefs.setString('user_id', userObj.id);
    await prefs.setString('user_name', userObj.name);
    await prefs.setString('user_phone', userObj.phone);
    await prefs.setString('user_email', userObj.email);
    await prefs.setString('user_role', userObj.role);
    notifyListeners();
  }

  Future<void> logout() async {
    _user = null;
    _token = null;
    await ApiService.removeToken();
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
