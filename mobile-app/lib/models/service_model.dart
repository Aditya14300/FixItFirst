import 'category_model.dart';

class ServiceModel {
  final String id;
  final String name;
  final CategoryModel? category;
  final String description;
  final double price;
  final double discountPrice;
  final int duration; // in minutes
  final String image;
  final bool isActive;

  ServiceModel({
    required this.id,
    required this.name,
    this.category,
    required this.description,
    required this.price,
    this.discountPrice = 0,
    required this.duration,
    this.image = '',
    this.isActive = true,
  });

  double get finalPrice => discountPrice > 0 ? discountPrice : price;
  bool get hasDiscount => discountPrice > 0 && discountPrice < price;

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    CategoryModel? categoryObj;
    if (json['category'] != null) {
      if (json['category'] is Map<String, dynamic>) {
        categoryObj = CategoryModel.fromJson(json['category']);
      } else if (json['category'] is String) {
        categoryObj = CategoryModel(id: json['category'], name: '');
      }
    }

    return ServiceModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      category: categoryObj,
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      discountPrice: (json['discountPrice'] ?? 0).toDouble(),
      duration: json['duration'] ?? 60,
      image: json['image'] ?? '',
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category?.toJson(),
      'description': description,
      'price': price,
      'discountPrice': discountPrice,
      'duration': duration,
      'image': image,
      'isActive': isActive,
    };
  }
}
