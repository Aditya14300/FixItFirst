class CategoryModel {
  final String id;
  final String name;
  final String description;
  final String icon;
  final bool isActive;

  CategoryModel({
    required this.id,
    required this.name,
    this.description = '',
    this.icon = '',
    this.isActive = true,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      icon: json['icon'] ?? '',
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'icon': icon,
      'isActive': isActive,
    };
  }
}
