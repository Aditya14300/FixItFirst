import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../models/service_model.dart';
import '../../providers/service_provider.dart';
import '../../widgets/database_error_widget.dart';
import '../services/service_detail_screen.dart';
import '../services/services_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  IconData _getCategoryIcon(String iconName) {
    switch (iconName.toLowerCase()) {
      case 'air conditioner service':
      case 'ac_unit':
      case 'ac repair':
        return Icons.ac_unit_rounded;
      case 'home electrical':
      case 'electrical':
        return Icons.electrical_services_rounded;
      case 'chimney service':
        return Icons.soup_kitchen_rounded;
      case 'washing machine service':
        return Icons.local_laundry_service_rounded;
      case 'refrigerator service':
      case 'kitchen':
        return Icons.kitchen_rounded;
      case 'cctv service':
        return Icons.videocam_rounded;
      default:
        return Icons.home_repair_service_rounded;
    }
  }

  // Interleaves sub-services across all main categories so every category is represented in Popular Services!
  List<ServiceModel> _getPopularServicesAcrossCategories(List<ServiceModel> allServices) {
    if (allServices.isEmpty) return [];

    final Map<String, List<ServiceModel>> categoryMap = {};
    for (final service in allServices) {
      final catName = service.category?.name ?? 'Other Services';
      if (!categoryMap.containsKey(catName)) {
        categoryMap[catName] = [];
      }
      categoryMap[catName]!.add(service);
    }

    final List<ServiceModel> popularList = [];
    int maxIndex = 0;
    for (final list in categoryMap.values) {
      if (list.length > maxIndex) maxIndex = list.length;
    }

    for (int i = 0; i < maxIndex; i++) {
      for (final catName in categoryMap.keys) {
        final list = categoryMap[catName]!;
        if (i < list.length) {
          popularList.add(list[i]);
        }
      }
    }

    return popularList;
  }

  @override
  Widget build(BuildContext context) {
    final serviceProvider = Provider.of<ServiceProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final popularServices = _getPopularServicesAcrossCategories(serviceProvider.services);

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await serviceProvider.loadInitialData();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.only(bottom: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Database Disconnection Error Handling Banner
                if (serviceProvider.isOffline)
                  DatabaseErrorWidget(
                    onRetry: () => serviceProvider.loadInitialData(),
                  ),

                // Top Header Section (App Logo Only)
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: AppTheme.primary.withValues(alpha: 0.2),
                            width: 1,
                          ),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            'https://res.cloudinary.com/dmsgeia9g/image/upload/v1782974140/logo_e536po.png',
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.build_circle_rounded, color: AppTheme.primary, size: 24),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'FixitFirst',
                            style: GoogleFonts.outfit(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: isDark ? Colors.white : AppTheme.textLightPrimary,
                              letterSpacing: 0.5,
                            ),
                          ),
                          Text(
                            'PREMIUM HOME SERVICES',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primary,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Hero Banner Section
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Trust Tag
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.primary.withValues(alpha: 0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.star_rounded, color: AppTheme.primaryDark, size: 14),
                            const SizedBox(width: 6),
                            Text(
                              'TRUSTED BY 1000+ CUSTOMERS',
                              style: GoogleFonts.outfit(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.primaryDark,
                                letterSpacing: 0.8,
                              ),
                            ),
                          ],
                        ),
                      ).animate().fadeIn(duration: 400.ms).slideX(begin: -0.1),

                      const SizedBox(height: 12),

                      Text(
                        'Professional Home Services',
                        style: GoogleFonts.outfit(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          height: 1.15,
                        ),
                      ).animate().fadeIn(delay: 100.ms),

                      Row(
                        children: [
                          Text(
                            'At Your Doorstep',
                            style: GoogleFonts.outfit(
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.primaryDark,
                              height: 1.15,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.handyman_rounded, color: AppTheme.primaryDark, size: 24),
                        ],
                      ).animate().fadeIn(delay: 200.ms),

                      const SizedBox(height: 16),

                      // Search Input
                      Container(
                        decoration: BoxDecoration(
                          color: isDark ? AppTheme.darkSurface : Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.05),
                              blurRadius: 15,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            const SizedBox(width: 14),
                            const Icon(Icons.search_rounded, color: AppTheme.textDarkSecondary),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TextField(
                                onChanged: (value) => serviceProvider.setSearchQuery(value),
                                decoration: InputDecoration(
                                  hintText: 'Search AC repair, plumbing, fan...',
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                  fillColor: Colors.transparent,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                                  hintStyle: GoogleFonts.plusJakartaSans(
                                    fontSize: 13,
                                    color: isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary,
                                  ),
                                ),
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(builder: (context) => const ServicesScreen()),
                                );
                              },
                              child: Container(
                                margin: const EdgeInsets.all(4),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: AppTheme.primary,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      'Book',
                                      style: GoogleFonts.outfit(
                                        fontWeight: FontWeight.w800,
                                        color: const Color(0xFF0F172A),
                                        fontSize: 14,
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    const Icon(Icons.arrow_forward_rounded, size: 16, color: Color(0xFF0F172A)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 4 Trust Feature Cards Grid
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      _buildTrustFeature(context, icon: Icons.verified_user_rounded, title: '500+', desc: 'Verified'),
                      const SizedBox(width: 8),
                      _buildTrustFeature(context, icon: Icons.timer_rounded, title: '30 Min', desc: 'Arrival'),
                      const SizedBox(width: 8),
                      _buildTrustFeature(context, icon: Icons.star_rounded, title: '4.9/5', desc: 'Rating'),
                      const SizedBox(width: 8),
                      _buildTrustFeature(context, icon: Icons.check_circle_rounded, title: '100%', desc: 'Warranty'),
                    ],
                  ),
                ).animate().fadeIn(delay: 400.ms),

                const SizedBox(height: 28),

                // Categories Section Header (Without 'See All')
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    'Categories',
                    style: GoogleFonts.outfit(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Categories Horizontal Scroll
                SizedBox(
                  height: 105,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    itemCount: serviceProvider.categories.length,
                    itemBuilder: (context, index) {
                      final category = serviceProvider.categories[index];
                      final isSelected = serviceProvider.selectedCategoryId == category.id;

                      return GestureDetector(
                        onTap: () {
                          serviceProvider.filterByCategory(
                            isSelected ? 'all' : category.id,
                          );
                        },
                        child: Container(
                          width: 84,
                          margin: const EdgeInsets.symmetric(horizontal: 6),
                          child: Column(
                            children: [
                              Container(
                                width: 62,
                                height: 62,
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppTheme.primary
                                      : (isDark ? AppTheme.darkSurface : Colors.white),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isSelected ? AppTheme.primary : (isDark ? AppTheme.darkBorder : AppTheme.lightBorder),
                                    width: 1.5,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.04),
                                      blurRadius: 8,
                                    )
                                  ],
                                ),
                                child: Icon(
                                  _getCategoryIcon(category.name),
                                  color: isSelected ? const Color(0xFF0F172A) : AppTheme.primaryDark,
                                  size: 26,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                category.name,
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 12,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                                  color: isSelected ? AppTheme.primaryDark : null,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 20),

                // Popular Services Header (Navigates to ServicesScreen on 'Explore' click)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Popular Services',
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const ServicesScreen(),
                            ),
                          );
                        },
                        child: Row(
                          children: [
                            Text(
                              'Explore',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.primaryDark,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.arrow_forward_ios_rounded,
                              size: 12,
                              color: AppTheme.primaryDark,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Popular Services List Across All Main Categories
                serviceProvider.isLoading
                    ? const Center(
                        child: Padding(
                          padding: EdgeInsets.all(24.0),
                          child: CircularProgressIndicator(),
                        ),
                      )
                    : popularServices.isEmpty
                        ? Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Center(
                              child: Text(
                                'No services found.',
                                style: GoogleFonts.plusJakartaSans(
                                  color: AppTheme.textDarkSecondary,
                                ),
                              ),
                            ),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            itemCount: popularServices.length,
                            itemBuilder: (context, index) {
                              final service = popularServices[index];
                              return _buildServiceCard(context, service, index);
                            },
                          ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTrustFeature(BuildContext context, {required IconData icon, required String title, required String desc}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 2),
        decoration: BoxDecoration(
          color: isDark ? AppTheme.darkSurface : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: AppTheme.primaryDark, size: 18),
            const SizedBox(height: 3),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                title,
                maxLines: 1,
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                desc,
                maxLines: 1,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10,
                  color: isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceCard(BuildContext context, ServiceModel service, int index) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ServiceDetailScreen(service: service),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: isDark ? AppTheme.darkSurface : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            // Image Thumbnail
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(18),
                bottomLeft: Radius.circular(18),
              ),
              child: Container(
                width: 110,
                height: 110,
                color: AppTheme.primary.withValues(alpha: 0.08),
                child: service.image.isNotEmpty
                    ? Image.network(
                        service.image,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                            const Icon(Icons.build_rounded, size: 36, color: AppTheme.primaryDark),
                      )
                    : const Icon(Icons.build_rounded, size: 36, color: AppTheme.primaryDark),
              ),
            ),
            const SizedBox(width: 14),

            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (service.category != null)
                      Text(
                        service.category!.name.toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.secondary,
                        ),
                      ),
                    const SizedBox(height: 2),
                    Text(
                      service.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.schedule_rounded, size: 14, color: AppTheme.textDarkSecondary),
                        const SizedBox(width: 4),
                        Text(
                          '${service.duration} mins',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            color: isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          '₹${service.finalPrice.toInt()}',
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: isDark ? AppTheme.primary : AppTheme.textLightPrimary,
                          ),
                        ),
                        if (service.hasDiscount) ...[
                          const SizedBox(width: 8),
                          Text(
                            '₹${service.price.toInt()}',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              color: isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 100 * (index % 5))).slideY(begin: 0.1);
  }
}
