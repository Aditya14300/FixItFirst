import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api_constants.dart';

class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, {this.statusCode = 500});

  @override
  String toString() => message;
}

class ApiService {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<Map<String, String>> _getHeaders({bool requireAuth = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requireAuth) {
      final token = await getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  static Future<dynamic> get(String endpoint, {bool requireAuth = false}) async {
    final headers = await _getHeaders(requireAuth: requireAuth);

    try {
      final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
      final response = await http
          .get(url, headers: headers)
          .timeout(const Duration(seconds: 5));
      return _handleResponse(response);
    } on ApiException {
      rethrow;
    } catch (e) {
      if (Platform.isAndroid) {
        final fallbacks = [
          'https://fixitfirst.onrender.com/api$endpoint',
          'http://10.250.185.62:5000/api$endpoint',
          'http://10.0.2.2:5000/api$endpoint',
          'http://127.0.0.1:5000/api$endpoint',
          'http://localhost:5000/api$endpoint',
        ];
        for (var fb in fallbacks) {
          try {
            final response = await http
                .get(Uri.parse(fb), headers: headers)
                .timeout(const Duration(seconds: 4));
            return _handleResponse(response);
          } on ApiException {
            rethrow;
          } catch (_) {}
        }
      }
      throw ApiException('Cannot reach backend server at ${ApiConstants.baseUrl}. Please check your internet connection.');
    }
  }

  static Future<dynamic> post(String endpoint, Map<String, dynamic> body,
      {bool requireAuth = false}) async {
    final headers = await _getHeaders(requireAuth: requireAuth);

    try {
      final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
      final response = await http
          .post(
            url,
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 5));
      return _handleResponse(response);
    } on ApiException {
      rethrow;
    } catch (e) {
      if (Platform.isAndroid) {
        final fallbacks = [
          'https://fixitfirst.onrender.com/api$endpoint',
          'http://10.250.185.62:5000/api$endpoint',
          'http://10.0.2.2:5000/api$endpoint',
          'http://127.0.0.1:5000/api$endpoint',
          'http://localhost:5000/api$endpoint',
        ];
        for (var fb in fallbacks) {
          try {
            final response = await http
                .post(
                  Uri.parse(fb),
                  headers: headers,
                  body: jsonEncode(body),
                )
                .timeout(const Duration(seconds: 4));
            return _handleResponse(response);
          } on ApiException {
            rethrow;
          } catch (_) {}
        }
      }
      throw ApiException('Cannot reach backend server at ${ApiConstants.baseUrl}. Please check your internet connection.');
    }
  }

  static Future<dynamic> put(String endpoint, Map<String, dynamic> body,
      {bool requireAuth = false}) async {
    final headers = await _getHeaders(requireAuth: requireAuth);

    try {
      final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
      final response = await http
          .put(
            url,
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 5));
      return _handleResponse(response);
    } on ApiException {
      rethrow;
    } catch (e) {
      if (Platform.isAndroid) {
        final fallbacks = [
          'https://fixitfirst.onrender.com/api$endpoint',
          'http://10.250.185.62:5000/api$endpoint',
          'http://10.0.2.2:5000/api$endpoint',
          'http://127.0.0.1:5000/api$endpoint',
          'http://localhost:5000/api$endpoint',
        ];
        for (var fb in fallbacks) {
          try {
            final response = await http
                .put(
                  Uri.parse(fb),
                  headers: headers,
                  body: jsonEncode(body),
                )
                .timeout(const Duration(seconds: 4));
            return _handleResponse(response);
          } on ApiException {
            rethrow;
          } catch (_) {}
        }
      }
      throw ApiException('Cannot reach backend server at ${ApiConstants.baseUrl}. Please check your internet connection.');
    }
  }

  static dynamic _handleResponse(http.Response response) {
    try {
      final data = jsonDecode(response.body);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return data;
      } else {
        final message = data['message'] ?? 'Request failed with status ${response.statusCode}';
        throw ApiException(message, statusCode: response.statusCode);
      }
    } on FormatException {
      throw ApiException('Invalid response format from server (${response.statusCode})');
    }
  }
}
