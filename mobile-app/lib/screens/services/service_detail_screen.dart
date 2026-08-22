import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../models/service_model.dart';
import '../../providers/auth_provider.dart';
import '../auth/register_screen.dart';
import '../booking/book_service_screen.dart';

class ServiceDetailScreen extends StatelessWidget {
  final ServiceModel service;

  const ServiceDetailScreen({super.key, required this.service});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;
    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Collapsible Image Header Bar with High Contrast Back Button
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            leading: Padding(
              padding: const EdgeInsets.all(8.0),
              child: CircleAvatar(
                backgroundColor: Colors.black.withValues(alpha: 0.45),
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 20),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  service.image.isNotEmpty
                      ? Image.network(
                          service.image,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: AppTheme.primary,
                            child: const Icon(Icons.build_rounded, size: 72, color: Color(0xFF0F172A)),
                          ),
                        )
                      : Container(
                          color: AppTheme.primary,
                          child: const Icon(Icons.build_rounded, size: 72, color: Color(0xFF0F172A)),
                        ),
                  // Dark Top Gradient Overlay for Back Button Visibility
                  Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 90,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.black.withValues(alpha: 0.6),
                            Colors.transparent,
                          ],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Details Body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20.0, 20.0, 20.0, 100.0), // Extra bottom padding prevents bottom bar overlap!
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (service.category != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        service.category!.name.toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryDark,
                        ),
                      ),
                    ),
                  const SizedBox(height: 10),

                  Text(
                    service.name,
                    style: GoogleFonts.outfit(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textPrimaryColor,
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Highlights Wrap (Duration & Rating) - Prevents Row Text Overlapping!
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _buildHighlightBadge(
                        context: context,
                        icon: Icons.timer_outlined,
                        label: '${service.duration} Mins Service',
                      ),
                      _buildHighlightBadge(
                        context: context,
                        icon: Icons.star_rounded,
                        label: '4.8 (120+ Reviews)',
                        iconColor: AppTheme.accent,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'Service Description',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    service.description,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 15,
                      color: textSecondaryColor,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 24),

                  Text(
                    'What is included?',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textPrimaryColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildInclusionItem(context, 'Verified and background checked expert technician'),
                  _buildInclusionItem(context, 'Complete inspection and diagnosis included'),
                  _buildInclusionItem(context, '30-day post-service service guarantee'),
                  _buildInclusionItem(context, 'Transparent pricing with no hidden charges'),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom Booking Bar with Safe Padding
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: cardBgColor,
          border: Border(top: BorderSide(color: cardBorderColor)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.08),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              // Price Section
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Total Price',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: textSecondaryColor,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        '₹${service.finalPrice.toInt()}',
                        style: GoogleFonts.outfit(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryDark,
                        ),
                      ),
                      if (service.hasDiscount) ...[
                        const SizedBox(width: 6),
                        Text(
                          '₹${service.price.toInt()}',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            color: textSecondaryColor,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
              const SizedBox(width: 16),

              // Book Now Button
              Expanded(
                child: SizedBox(
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      final authProvider = Provider.of<AuthProvider>(context, listen: false);
                      if (!authProvider.isAuthenticated) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Please create an account to book your service.'),
                            backgroundColor: AppTheme.primary,
                            duration: Duration(seconds: 3),
                          ),
                        );
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (context) => const RegisterScreen()),
                        );
                        return;
                      }

                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => BookServiceScreen(service: service),
                        ),
                      );
                    },
                    child: Text(
                      'Book Service Now',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHighlightBadge({
    required BuildContext context,
    required IconData icon,
    required String label,
    Color iconColor = AppTheme.primaryDark,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final cardBgColor = isDark ? AppTheme.darkSurface : const Color(0xFFF1F5F9);
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: cardBorderColor),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: iconColor),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: textPrimaryColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInclusionItem(BuildContext context, String title) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 2),
            child: Icon(Icons.check_circle_rounded, color: AppTheme.success, size: 18),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: textPrimaryColor,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
