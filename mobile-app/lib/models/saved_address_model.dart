import 'dart:convert';

class SavedAddressModel {
  final String id;
  final String tag; // 'Home', 'Work', 'Other'
  final String fullAddress;
  final String landmark;
  final bool isDefault;

  SavedAddressModel({
    required this.id,
    required this.tag,
    required this.fullAddress,
    this.landmark = '',
    this.isDefault = false,
  });

  factory SavedAddressModel.fromJson(Map<String, dynamic> json) {
    return SavedAddressModel(
      id: json['id'] ?? 'addr_${DateTime.now().millisecondsSinceEpoch}',
      tag: json['tag'] ?? 'Home',
      fullAddress: json['fullAddress'] ?? '',
      landmark: json['landmark'] ?? '',
      isDefault: json['isDefault'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tag': tag,
      'fullAddress': fullAddress,
      'landmark': landmark,
      'isDefault': isDefault,
    };
  }

  static String encodeList(List<SavedAddressModel> list) {
    return jsonEncode(list.map((item) => item.toJson()).toList());
  }

  static List<SavedAddressModel> decodeList(String jsonString) {
    if (jsonString.isEmpty) return [];
    final List decoded = jsonDecode(jsonString);
    return decoded.map((item) => SavedAddressModel.fromJson(item)).toList();
  }
}
