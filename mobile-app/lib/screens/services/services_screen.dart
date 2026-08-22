import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../models/service_model.dart';
import '../../providers/service_provider.dart';
import '../../widgets/database_error_widget.dart';
import 'service_detail_screen.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final serviceProvider = Provider.of<ServiceProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;
    final headerBgColor = isDark ? AppTheme.darkBackground : AppTheme.lightBackground;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Services'),
        centerTitle: false,
      ),
      body: Column(
        children: [
          // Database Offline Connection Banner
          if (serviceProvider.isOffline)
            DatabaseErrorWidget(
              onRetry: () => serviceProvider.loadInitialData(),
            ),

          // Search Header Container
          Container(
            color: headerBgColor,
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: TextField(
              onChanged: (value) => serviceProvider.setSearchQuery(value),
              style: GoogleFonts.plusJakartaSans(color: textPrimaryColor),
              decoration: InputDecoration(
                hintText: 'Search service name or description...',
                hintStyle: GoogleFonts.plusJakartaSans(color: textSecondaryColor),
                prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primaryDark),
                fillColor: isDark ? AppTheme.darkSurface : Colors.white,
                filled: true,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: cardBorderColor),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppTheme.primaryDark, width: 1.5),
                ),
              ),
            ),
          ),

          // Categories Horizontal Filter Pills
          Container(
            color: headerBgColor,
            height: 46,
            padding: const EdgeInsets.only(bottom: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: serviceProvider.categories.length + 1,
              itemBuilder: (context, index) {
                if (index == 0) {
                  final isSelected = serviceProvider.selectedCategoryId == 'all';
                  return _buildFilterPill(
                    context: context,
                    label: 'All Services',
                    isSelected: isSelected,
                    onTap: () => serviceProvider.filterByCategory('all'),
                  );
                }

                final category = serviceProvider.categories[index - 1];
                final isSelected = serviceProvider.selectedCategoryId == category.id;
                return _buildFilterPill(
                  context: context,
                  label: category.name,
                  isSelected: isSelected,
                  onTap: () => serviceProvider.filterByCategory(category.id),
                );
              },
            ),
          ),
          Divider(height: 1, color: cardBorderColor),

          // Services Grid View
          Expanded(
            child: serviceProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : serviceProvider.services.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off_rounded, size: 64, color: textSecondaryColor.withValues(alpha: 0.6)),
                            const SizedBox(height: 12),
                            Text(
                              'No matching services found',
                              style: GoogleFonts.outfit(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: textPrimaryColor,
                              ),
                            ),
                          ],
                        ),
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.72,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                        ),
                        itemCount: serviceProvider.services.length,
                        itemBuilder: (context, index) {
                          final service = serviceProvider.services[index];
                          return _buildGridCard(context, service);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterPill({
    required BuildContext context,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    final pillBg = isSelected
        ? AppTheme.primary
        : (isDark ? AppTheme.darkSurface : const Color(0xFFF1F5F9));
    final pillText = isSelected
        ? const Color(0xFF0F172A)
        : textPrimaryColor;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: pillBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppTheme.primary : cardBorderColor,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: pillText,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGridCard(BuildContext context, ServiceModel service) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;

    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ServiceDetailScreen(service: service),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: cardBgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: cardBorderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
              blurRadius: 8,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Service Image Container
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                ),
                child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: service.image.isNotEmpty
                      ? Image.network(
                          service.image,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Center(
                            child: Icon(
                              Icons.build_rounded,
                              size: 38,
                              color: isDark ? AppTheme.primaryLight : AppTheme.primaryDark,
                            ),
                          ),
                        )
                      : Center(
                          child: Icon(
                            Icons.build_rounded,
                            size: 38,
                            color: isDark ? AppTheme.primaryLight : AppTheme.primaryDark,
                          ),
                        ),
                ),
              ),
            ),

            // Card Text Details
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    service.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: textPrimaryColor,
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${service.duration} mins service',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: textSecondaryColor,
                    ),
                  ),
                  const SizedBox(height: 8),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Starting from',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                color: textSecondaryColor,
                              ),
                            ),
                            Text(
                              '₹${service.finalPrice.toInt()}',
                              style: GoogleFonts.outfit(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.primaryDark,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppTheme.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.arrow_forward_rounded,
                          color: Color(0xFF0F172A),
                          size: 14,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
