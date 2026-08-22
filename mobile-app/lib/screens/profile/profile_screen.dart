import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/address_provider.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';
import '../auth/register_screen.dart';
import 'saved_addresses_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // User / Guest / Demo Header Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: cardBgColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: cardBorderColor),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 32,
                    backgroundColor: AppTheme.primaryDark,
                    child: Text(
                      authProvider.isRealUser && user != null
                          ? user.name.substring(0, 1).toUpperCase()
                          : authProvider.isDemoUser
                              ? 'D'
                              : 'G',
                      style: GoogleFonts.outfit(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          authProvider.isRealUser && user != null
                              ? user.name
                              : authProvider.isDemoUser
                                  ? (user?.name ?? 'Demo User')
                                  : 'Guest User',
                          style: GoogleFonts.outfit(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: textPrimaryColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          authProvider.isRealUser && user != null
                              ? user.phone
                              : authProvider.isDemoUser
                                  ? 'Demo Account (Sign in for full access)'
                                  : 'Log in or sign up for full access',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14,
                            color: textSecondaryColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Prominent Login & Sign Up Section (Shown for Demo users and Guest users)
            if (!authProvider.isRealUser) ...[
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: isDark
                      ? AppTheme.darkSurface
                      : AppTheme.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isDark
                        ? AppTheme.darkBorder
                        : AppTheme.primary.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.account_circle_rounded,
                          color: AppTheme.primaryDark,
                          size: 24,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            authProvider.isDemoUser
                                ? 'Sign in to access your profile & settings'
                                : 'Get started with FixItFirst',
                            style: GoogleFonts.outfit(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textPrimaryColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Log in to your existing account or create a new one to manage saved addresses, track orders, and configure settings.',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        color: textSecondaryColor,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        // Log In Button (Dark Slate button with crisp white text)
                        Expanded(
                          child: SizedBox(
                            height: 48,
                            child: ElevatedButton.icon(
                              onPressed: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (context) => const LoginScreen(),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0F172A),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                              icon: const Icon(Icons.login_rounded, size: 18),
                              label: Text(
                                'Log In',
                                style: GoogleFonts.outfit(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Sign Up Button (Bright Yellow button with dark slate text)
                        Expanded(
                          child: SizedBox(
                            height: 48,
                            child: ElevatedButton.icon(
                              onPressed: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (context) => const RegisterScreen(),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.primary,
                                foregroundColor: const Color(0xFF0F172A),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                              icon: const Icon(Icons.person_add_rounded, size: 18),
                              label: Text(
                                'Sign Up',
                                style: GoogleFonts.outfit(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Account Settings List (Shown ONLY for REAL authenticated accounts)
            if (authProvider.isRealUser) ...[
              _buildSectionHeader('Account Settings', textSecondaryColor),
              const SizedBox(height: 10),
              Consumer<AddressProvider>(
                builder: (context, addressProvider, _) {
                  final def = addressProvider.defaultAddress;
                  final subtitleText = def != null
                      ? '${def.tag}: ${def.fullAddress}'
                      : 'Manage home & office service locations';

                  return _buildProfileTile(
                    context: context,
                    icon: Icons.location_on_outlined,
                    title: 'Saved Addresses',
                    subtitle: subtitleText,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const SavedAddressesScreen(),
                        ),
                      );
                    },
                  );
                },
              ),
              _buildProfileTile(
                context: context,
                icon: Icons.notifications_outlined,
                title: 'Notification Preferences',
                subtitle: 'Order updates and promotional offers',
                onTap: () {},
              ),
              const SizedBox(height: 24),
            ],

            _buildSectionHeader('Support & Legal', textSecondaryColor),
            const SizedBox(height: 10),
            _buildProfileTile(
              context: context,
              icon: Icons.headset_mic_outlined,
              title: 'Customer Support 24/7',
              subtitle: 'Chat or call our dedicated helpdesk',
              onTap: () {},
            ),
            _buildProfileTile(
              context: context,
              icon: Icons.privacy_tip_outlined,
              title: 'Terms & Privacy Policy',
              subtitle: 'Read terms of service',
              onTap: () {},
            ),
            const SizedBox(height: 28),

            // Logout Button (Shown ONLY for REAL authenticated accounts)
            if (authProvider.isRealUser)
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton.icon(
                  onPressed: () {
                    authProvider.logout();
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.error,
                    side: const BorderSide(color: AppTheme.error),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  icon: const Icon(Icons.logout_rounded),
                  label: const Text('Log Out'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color textColor) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: textColor,
        ),
      ),
    );
  }

  Widget _buildProfileTile({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: cardBorderColor),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: isDark
                ? AppTheme.primary.withValues(alpha: 0.15)
                : AppTheme.primaryDark.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            color: isDark ? AppTheme.primary : AppTheme.primaryDark,
          ),
        ),
        title: Text(
          title,
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            fontSize: 15,
            color: textPrimaryColor,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            color: textSecondaryColor,
          ),
        ),
        trailing: Icon(
          Icons.chevron_right_rounded,
          color: textSecondaryColor,
        ),
      ),
    );
  }
}
