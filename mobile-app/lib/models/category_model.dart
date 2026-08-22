class CategoryModel {
  final String id;
  final String name;
  final String description;
  final String icon; // Icon name for Flutter mobile app
  final String image; // Image URL for website display
  final int bookingCount; // Number of bookings for category
  final bool isActive;

  CategoryModel({
    required this.id,
    required this.name,
    this.description = '',
    this.icon = '',
    this.image = '',
    this.bookingCount = 0,
    this.isActive = true,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      icon: json['icon'] ?? '',
      image: json['image'] ?? json['img'] ?? '',
      bookingCount: json['bookingCount'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'icon': icon,
      'image': image,
      'bookingCount': bookingCount,
      'isActive': isActive,
    };
  }
}
