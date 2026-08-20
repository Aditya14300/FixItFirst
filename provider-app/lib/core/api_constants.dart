class ApiConstants {
  // Base backend URL (deployed on Render)
  static const String baseUrl = 'https://fixitfirst.onrender.com/api';

  // Auth Endpoints
  static const String loginEndpoint = '$baseUrl/auth/login';
  static const String registerEndpoint = '$baseUrl/auth/register';
  static const String profileEndpoint = '$baseUrl/auth/profile';

  // Booking Endpoints
  static const String bookingsEndpoint = '$baseUrl/bookings';
  static String updateBookingStatusEndpoint(String bookingId) => '$baseUrl/bookings/$bookingId/status';
  static String cancelBookingEndpoint(String bookingId) => '$baseUrl/bookings/$bookingId/cancel';

  // Headers
  static Map<String, String> headers({String? token}) {
    final Map<String, String> map = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      map['Authorization'] = 'Bearer $token';
    }
    return map;
  }
}
