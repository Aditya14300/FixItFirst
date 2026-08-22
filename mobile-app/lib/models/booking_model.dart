import 'service_model.dart';
import 'user_model.dart';

class BookingModel {
  final String id;
  final ServiceModel service;
  final UserModel? user;
  final String date;
  final String timeSlot;
  final String address;
  final String status; // 'pending', 'confirmed', 'completed', 'cancelled'
  final double totalAmount;
  final String notes;
  final String cancellationReason;
  final DateTime createdAt;

  BookingModel({
    required this.id,
    required this.service,
    this.user,
    required this.date,
    required this.timeSlot,
    required this.address,
    this.status = 'pending',
    required this.totalAmount,
    this.notes = '',
    this.cancellationReason = '',
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    // Dynamic Service parsing: handles both nested ServiceModel and flat backend serviceName string!
    final ServiceModel serviceObj = json['service'] is Map<String, dynamic>
        ? ServiceModel.fromJson(json['service'])
        : ServiceModel(
            id: json['_id'] ?? '',
            name: json['serviceName'] ?? json['service']?.toString() ?? 'Home Service',
            description: json['notes'] ?? 'Professional Repair Service',
            price: (json['amount'] ?? json['totalAmount'] ?? 0).toDouble(),
            discountPrice: (json['amount'] ?? json['totalAmount'] ?? 0).toDouble(),
            duration: 45,
          );

    final UserModel? userObj = json['user'] is Map<String, dynamic>
        ? UserModel.fromJson(json['user'])
        : json['customerName'] != null
            ? UserModel(
                id: 'u1',
                name: json['customerName'] ?? 'Customer',
                email: '',
                phone: json['customerPhone'] ?? '',
                role: 'customer',
              )
            : null;

    return BookingModel(
      id: json['_id'] ?? json['id'] ?? '',
      service: serviceObj,
      user: userObj,
      date: json['date'] ?? '',
      timeSlot: json['timeSlot'] ?? '',
      address: json['address'] ?? '',
      status: json['status'] ?? 'pending',
      totalAmount: (json['amount'] ?? json['totalAmount'] ?? 0).toDouble(),
      notes: json['notes'] ?? '',
      cancellationReason: json['cancellationReason'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'service': service.toJson(),
      'user': user?.toJson(),
      'date': date,
      'timeSlot': timeSlot,
      'address': address,
      'status': status,
      'totalAmount': totalAmount,
      'notes': notes,
      'cancellationReason': cancellationReason,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
