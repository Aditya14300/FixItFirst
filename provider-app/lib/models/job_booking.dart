class JobBooking {
  final String id;
  final String customerName;
  final String customerPhone;
  final String serviceName;
  final String date;
  final String timeSlot;
  final String address;
  final double amount;
  final String status; // 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  final String notes;
  final DateTime createdAt;

  JobBooking({
    required this.id,
    required this.customerName,
    required this.customerPhone,
    required this.serviceName,
    required this.date,
    required this.timeSlot,
    required this.address,
    required this.amount,
    required this.status,
    this.notes = '',
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory JobBooking.fromJson(Map<String, dynamic> json) {
    return JobBooking(
      id: json['id'] ?? json['_id'] ?? '',
      customerName: json['customerName'] ?? 'Customer',
      customerPhone: json['customerPhone'] ?? '',
      serviceName: json['serviceName'] ?? 'Service',
      date: json['date'] ?? '',
      timeSlot: json['timeSlot'] ?? '',
      address: json['address'] ?? '',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0.0,
      status: json['status'] ?? 'pending',
      notes: json['notes'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customerName': customerName,
      'customerPhone': customerPhone,
      'serviceName': serviceName,
      'date': date,
      'timeSlot': timeSlot,
      'address': address,
      'amount': amount,
      'status': status,
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  JobBooking copyWith({
    String? id,
    String? customerName,
    String? customerPhone,
    String? serviceName,
    String? date,
    String? timeSlot,
    String? address,
    double? amount,
    String? status,
    String? notes,
    DateTime? createdAt,
  }) {
    return JobBooking(
      id: id ?? this.id,
      customerName: customerName ?? this.customerName,
      customerPhone: customerPhone ?? this.customerPhone,
      serviceName: serviceName ?? this.serviceName,
      date: date ?? this.date,
      timeSlot: timeSlot ?? this.timeSlot,
      address: address ?? this.address,
      amount: amount ?? this.amount,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
