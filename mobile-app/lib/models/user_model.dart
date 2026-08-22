class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String address;
  final String role;
  final String profileImage;
  final bool isVerified;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.address = '',
    required this.role,
    this.profileImage = '',
    this.isVerified = false,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      address: json['address'] ?? '',
      role: json['role'] ?? 'customer',
      profileImage: json['profileImage'] ?? '',
      isVerified: json['isVerified'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'address': address,
      'role': role,
      'profileImage': profileImage,
      'isVerified': isVerified,
    };
  }
}
