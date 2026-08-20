class ProviderUser {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role;
  final String profileImage;
  final bool isVerified;
  final bool isOnline;
  final List<String> categories;
  final double rating;
  final int completedJobsCount;

  ProviderUser({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.role = 'technician',
    this.profileImage = '',
    this.isVerified = true,
    this.isOnline = true,
    this.categories = const ['Plumbing', 'Electrical Repair', 'AC Maintenance'],
    this.rating = 4.9,
    this.completedJobsCount = 42,
  });

  factory ProviderUser.fromJson(Map<String, dynamic> json) {
    return ProviderUser(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? 'technician',
      profileImage: json['profileImage'] ?? '',
      isVerified: json['isVerified'] ?? true,
      isOnline: json['isOnline'] ?? true,
      categories: json['categories'] != null
          ? List<String>.from(json['categories'])
          : ['Plumbing', 'Electrical Repair', 'AC Maintenance'],
      rating: (json['rating'] ?? 4.9).toDouble(),
      completedJobsCount: json['completedJobsCount'] ?? 42,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'profileImage': profileImage,
      'isVerified': isVerified,
      'isOnline': isOnline,
      'categories': categories,
      'rating': rating,
      'completedJobsCount': completedJobsCount,
    };
  }

  ProviderUser copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? role,
    String? profileImage,
    bool? isVerified,
    bool? isOnline,
    List<String>? categories,
    double? rating,
    int? completedJobsCount,
  }) {
    return ProviderUser(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      profileImage: profileImage ?? this.profileImage,
      isVerified: isVerified ?? this.isVerified,
      isOnline: isOnline ?? this.isOnline,
      categories: categories ?? this.categories,
      rating: rating ?? this.rating,
      completedJobsCount: completedJobsCount ?? this.completedJobsCount,
    );
  }
}
