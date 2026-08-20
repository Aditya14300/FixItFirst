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
  // Render free instance timeout: 60-second minimum to handle cold starts (~50s wake-up time)
  static const Duration _timeoutDuration = Duration(seconds: 60);

  // --- Token Management ---
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  // --- Request Headers ---
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

  // --- GET Request ---
  static Future<dynamic> get(String endpoint, {bool requireAuth = false}) async {
    final headers = await _getHeaders(requireAuth: requireAuth);
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');

    try {
      final response = await http
          .get(url, headers: headers)
          .timeout(_timeoutDuration);
      return _handleResponse(response);
    } on TimeoutException {
      throw ApiException(
        'Server is waking up (Render backend cold start). Please wait a moment and try again.',
        statusCode: 504,
      );
    } on SocketException {
      throw ApiException(
        'No Internet connection. Please check your network connectivity and try again.',
        statusCode: 503,
      );
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(
        _cleanErrorMessage(e.toString()),
        statusCode: 500,
      );
    }
  }

  // --- POST Request ---
  static Future<dynamic> post(
    String endpoint,
    Map<String, dynamic> body, {
    bool requireAuth = false,
  }) async {
    final headers = await _getHeaders(requireAuth: requireAuth);
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');

    try {
      final response = await http
          .post(
            url,
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(_timeoutDuration);
      return _handleResponse(response);
    } on TimeoutException {
      throw ApiException(
        'Server is waking up (Render backend cold start). Please wait a moment and try again.',
        statusCode: 504,
      );
    } on SocketException {
      throw ApiException(
        'No Internet connection. Please check your network connectivity and try again.',
        statusCode: 503,
      );
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(
        _cleanErrorMessage(e.toString()),
        statusCode: 500,
      );
    }
  }

  // --- PUT Request ---
  static Future<dynamic> put(
    String endpoint,
    Map<String, dynamic> body, {
    bool requireAuth = false,
  }) async {
    final headers = await _getHeaders(requireAuth: requireAuth);
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');

    try {
      final response = await http
          .put(
            url,
            headers: headers,
            body: jsonEncode(body),
          )
          .timeout(_timeoutDuration);
      return _handleResponse(response);
    } on TimeoutException {
      throw ApiException(
        'Server is waking up (Render backend cold start). Please wait a moment and try again.',
        statusCode: 504,
      );
    } on SocketException {
      throw ApiException(
        'No Internet connection. Please check your network connectivity and try again.',
        statusCode: 503,
      );
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(
        _cleanErrorMessage(e.toString()),
        statusCode: 500,
      );
    }
  }

  // --- DELETE Request ---
  static Future<dynamic> delete(
    String endpoint, {
    bool requireAuth = false,
  }) async {
    final headers = await _getHeaders(requireAuth: requireAuth);
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');

    try {
      final response = await http
          .delete(url, headers: headers)
          .timeout(_timeoutDuration);
      return _handleResponse(response);
    } on TimeoutException {
      throw ApiException(
        'Server is waking up (Render backend cold start). Please wait a moment and try again.',
        statusCode: 504,
      );
    } on SocketException {
      throw ApiException(
        'No Internet connection. Please check your network connectivity and try again.',
        statusCode: 503,
      );
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(
        _cleanErrorMessage(e.toString()),
        statusCode: 500,
      );
    }
  }

  // --- Response Parsing & Error Extraction ---
  static dynamic _handleResponse(http.Response response) {
    dynamic data;
    try {
      if (response.body.isNotEmpty) {
        data = jsonDecode(response.body);
      }
    } on FormatException {
      throw ApiException(
        'Invalid server response format (${response.statusCode})',
        statusCode: response.statusCode,
      );
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data ?? {'success': true};
    } else {
      String message = 'Request failed with status ${response.statusCode}';
      if (data is Map) {
        message = data['message'] ?? data['error'] ?? data['msg'] ?? message;
      }
      throw ApiException(message, statusCode: response.statusCode);
    }
  }

  static String _cleanErrorMessage(String rawMsg) {
    return rawMsg
        .replaceAll('Exception: ', '')
        .replaceAll('ClientException with ', '')
        .replaceAll('SocketException: ', '');
  }
}
