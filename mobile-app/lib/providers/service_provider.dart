import 'dart:async';
import 'package:flutter/material.dart';
import '../core/api_constants.dart';
import '../models/category_model.dart';
import '../models/service_model.dart';
import '../services/api_service.dart';

class ServiceProvider extends ChangeNotifier {
  List<CategoryModel> _categories = [];
  List<ServiceModel> _services = [];
  List<ServiceModel> _filteredServices = [];
  String _selectedCategoryId = 'all';
  String _searchQuery = '';
  bool _isLoadingCategories = false;
  bool _isLoadingServices = false;
  bool _isOffline = false;
  String? _error;
  Timer? _pollingTimer;

  List<CategoryModel> get categories => _categories;
  List<ServiceModel> get services => _filteredServices;
  List<ServiceModel> get allServices => _services;
  String get selectedCategoryId => _selectedCategoryId;
  String get searchQuery => _searchQuery;
  bool get isLoading => _isLoadingCategories || _isLoadingServices;
  bool get isOffline => _isOffline;
  String? get error => _error;

  ServiceProvider() {
    loadInitialData();
    _startRealtimePolling();
  }

  void _startRealtimePolling() {
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      fetchCategories(isSilent: true);
      fetchServices(isSilent: true);
    });
  }

  Future<void> loadInitialData() async {
    await fetchCategories();
    await fetchServices();
  }

  Future<void> fetchCategories({bool isSilent = false}) async {
    if (!isSilent) {
      _isLoadingCategories = true;
      notifyListeners();
    }

    try {
      final response = await ApiService.get(ApiConstants.categories);
      if (response != null && (response['success'] == true || response['categories'] != null)) {
        final List list = response['categories'] ?? (response is List ? response : []);
        _categories = list.map((json) => CategoryModel.fromJson(json)).toList();
        _isOffline = false;
        _error = null;
      }
    } on ApiException catch (e) {
      _error = e.message;
      _isOffline = true;
      if (_categories.isEmpty) {
        _categories = _getMockCategories();
      }
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isOffline = true;
      if (_categories.isEmpty) {
        _categories = _getMockCategories();
      }
    } finally {
      if (!isSilent) {
        _isLoadingCategories = false;
      }
      notifyListeners();
    }
  }

  Future<void> fetchServices({bool isSilent = false}) async {
    if (!isSilent) {
      _isLoadingServices = true;
      notifyListeners();
    }

    try {
      final response = await ApiService.get(ApiConstants.services);
      if (response != null && (response['success'] == true || response['services'] != null)) {
        final List list = response['services'] ?? (response is List ? response : []);
        _services = list.map((json) => ServiceModel.fromJson(json)).toList();
        _isOffline = false;
        _error = null;
      }
    } on ApiException catch (e) {
      _error = e.message;
      _isOffline = true;
      if (_services.isEmpty) {
        _services = _getMockServices();
      }
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isOffline = true;
      if (_services.isEmpty) {
        _services = _getMockServices();
      }
    } finally {
      if (!isSilent) {
        _isLoadingServices = false;
      }
      _applyFilters();
      notifyListeners();
    }
  }

  void filterByCategory(String categoryId) {
    _selectedCategoryId = categoryId;
    _applyFilters();
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    _filteredServices = _services.where((service) {
      final matchesCategory = _selectedCategoryId == 'all' ||
          (service.category != null && service.category!.id == _selectedCategoryId);

      final matchesQuery = _searchQuery.isEmpty ||
          service.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          service.description.toLowerCase().contains(_searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    }).toList();
  }

  List<CategoryModel> _getMockCategories() {
    return [
      CategoryModel(id: 'cat1', name: 'Plumbing', description: 'Pipes & leak fixes', icon: 'plumbing'),
      CategoryModel(id: 'cat2', name: 'Electrical', description: 'Wiring & switch repairs', icon: 'electrical'),
      CategoryModel(id: 'cat3', name: 'AC Repair', description: 'AC service & gas refill', icon: 'ac_unit'),
      CategoryModel(id: 'cat4', name: 'Appliance', description: 'Washing machine & fridge', icon: 'kitchen'),
      CategoryModel(id: 'cat5', name: 'Carpentry', description: 'Furniture & door repair', icon: 'carpenter'),
      CategoryModel(id: 'cat6', name: 'Cleaning', description: 'Home & sofa deep clean', icon: 'cleaning_services'),
    ];
  }

  List<ServiceModel> _getMockServices() {
    return [
      ServiceModel(
        id: 'srv1',
        name: 'AC Deep Service & Cleaning',
        category: CategoryModel(id: 'cat3', name: 'AC Repair'),
        description: 'Complete jet spray wash of indoor & outdoor unit, filter cleaning, and pressure test.',
        price: 999,
        discountPrice: 799,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
      ),
      ServiceModel(
        id: 'srv2',
        name: 'Tap & Pipe Leak Repair',
        category: CategoryModel(id: 'cat1', name: 'Plumbing'),
        description: 'Fixing water leaks, pipe joint sealing, and tap replacement service.',
        price: 499,
        discountPrice: 349,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500',
      ),
      ServiceModel(
        id: 'srv3',
        name: 'Ceiling Fan Installation & Repair',
        category: CategoryModel(id: 'cat2', name: 'Electrical'),
        description: 'New fan hanging, regulator replacement, and capacitor fixing.',
        price: 399,
        discountPrice: 299,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=500',
      ),
      ServiceModel(
        id: 'srv4',
        name: 'Washing Machine Repair',
        category: CategoryModel(id: 'cat4', name: 'Appliance'),
        description: 'Diagnosis for motor noise, water drainage issue, and spin cycle problems.',
        price: 699,
        discountPrice: 549,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500',
      ),
      ServiceModel(
        id: 'srv5',
        name: 'Full Home Deep Cleaning',
        category: CategoryModel(id: 'cat6', name: 'Cleaning'),
        description: 'Professional deep cleaning of bedrooms, kitchen, bathrooms, and floor scrubbing.',
        price: 2999,
        discountPrice: 2499,
        duration: 180,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
      ),
    ];
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }
}
