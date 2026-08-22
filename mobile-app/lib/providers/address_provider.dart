import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/saved_address_model.dart';

class AddressProvider extends ChangeNotifier {
  static const String _storageKey = 'user_saved_addresses_v2';
  List<SavedAddressModel> _addresses = [];
  bool _isLoading = false;

  List<SavedAddressModel> get addresses => List.unmodifiable(_addresses);
  bool get isLoading => _isLoading;

  SavedAddressModel? get defaultAddress {
    if (_addresses.isEmpty) return null;
    return _addresses.firstWhere(
      (a) => a.isDefault,
      orElse: () => _addresses.first,
    );
  }

  AddressProvider() {
    loadAddresses();
  }

  Future<void> loadAddresses() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final storedJson = prefs.getString(_storageKey);

      if (storedJson != null && storedJson.isNotEmpty) {
        _addresses = SavedAddressModel.decodeList(storedJson);
        // Filter out any legacy dummy addresses if present
        _addresses.removeWhere((a) => a.id == 'addr_home' || a.id == 'addr_work');
      } else {
        _addresses = [];
        await _saveToStorage();
      }
    } catch (e) {
      debugPrint('Failed to load saved addresses: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addAddress({
    required String tag,
    required String fullAddress,
    String landmark = '',
    bool isDefault = false,
  }) async {
    final newId = 'addr_${DateTime.now().millisecondsSinceEpoch}';
    final shouldBeDefault = isDefault || _addresses.isEmpty;

    if (shouldBeDefault) {
      _addresses = _addresses.map((a) => SavedAddressModel(
        id: a.id,
        tag: a.tag,
        fullAddress: a.fullAddress,
        landmark: a.landmark,
        isDefault: false,
      )).toList();
    }

    final newAddr = SavedAddressModel(
      id: newId,
      tag: tag,
      fullAddress: fullAddress,
      landmark: landmark,
      isDefault: shouldBeDefault,
    );

    _addresses.add(newAddr);
    await _saveToStorage();
    notifyListeners();
  }

  Future<void> updateAddress({
    required String id,
    required String tag,
    required String fullAddress,
    String landmark = '',
    bool isDefault = false,
  }) async {
    final index = _addresses.indexWhere((a) => a.id == id);
    if (index == -1) return;

    if (isDefault) {
      _addresses = _addresses.map((a) => SavedAddressModel(
        id: a.id,
        tag: a.tag,
        fullAddress: a.fullAddress,
        landmark: a.landmark,
        isDefault: false,
      )).toList();
    }

    _addresses[index] = SavedAddressModel(
      id: id,
      tag: tag,
      fullAddress: fullAddress,
      landmark: landmark,
      isDefault: isDefault || (_addresses.length == 1),
    );

    await _saveToStorage();
    notifyListeners();
  }

  Future<void> deleteAddress(String id) async {
    final deletedWasDefault = _addresses.any((a) => a.id == id && a.isDefault);
    _addresses.removeWhere((a) => a.id == id);

    if (deletedWasDefault && _addresses.isNotEmpty) {
      final first = _addresses.first;
      _addresses[0] = SavedAddressModel(
        id: first.id,
        tag: first.tag,
        fullAddress: first.fullAddress,
        landmark: first.landmark,
        isDefault: true,
      );
    }

    await _saveToStorage();
    notifyListeners();
  }

  Future<void> setDefaultAddress(String id) async {
    _addresses = _addresses.map((a) => SavedAddressModel(
      id: a.id,
      tag: a.tag,
      fullAddress: a.fullAddress,
      landmark: a.landmark,
      isDefault: a.id == id,
    )).toList();

    await _saveToStorage();
    notifyListeners();
  }

  Future<void> _saveToStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = SavedAddressModel.encodeList(_addresses);
    await prefs.setString(_storageKey, jsonStr);
  }
}
