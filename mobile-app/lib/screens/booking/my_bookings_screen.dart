import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../models/booking_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/booking_provider.dart';
import '../auth/login_screen.dart';
import '../auth/register_screen.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      if (auth.isRealUser) {
        Provider.of<BookingProvider>(context, listen: false).fetchBookings(userPhone: auth.user?.phone);
      }
    });
  }

  void _showCancellationReasonModal(BuildContext context, BookingModel booking) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;
    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;

    final reasons = [
      'Booked by mistake / wrong service selected',
      'Schedule conflict / change of plans',
      'Found a better price / alternative option',
      'Need to change address or time slot',
      'Other (Please specify below)',
    ];

    String selectedReason = reasons[0];
    final otherReasonController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: cardBgColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final isOtherSelected = selectedReason == reasons.last;

            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: textSecondaryColor.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  Row(
                    children: [
                      const Icon(Icons.cancel_outlined, color: AppTheme.error, size: 24),
                      const SizedBox(width: 10),
                      Text(
                        'Cancel Booking',
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: textPrimaryColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Please select a reason for cancelling this booking:',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      color: textSecondaryColor,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Radio buttons for predefined cancellation reasons
                  ...reasons.map((reason) {
                    final isSelected = selectedReason == reason;
                    return GestureDetector(
                      onTap: () {
                        setModalState(() {
                          selectedReason = reason;
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppTheme.primary.withValues(alpha: 0.12)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSelected ? AppTheme.primaryDark : (isDark ? AppTheme.darkBorder : AppTheme.lightBorder),
                          ),
                        ),
                        child: Row(
                          children: [
                            Radio<String>(
                              value: reason,
                              groupValue: selectedReason,
                              activeColor: AppTheme.primaryDark,
                              onChanged: (val) {
                                if (val != null) {
                                  setModalState(() {
                                    selectedReason = val;
                                  });
                                }
                              },
                            ),
                            Expanded(
                              child: Text(
                                reason,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 13,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                  color: textPrimaryColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),

                  // If "Other" is selected, show Text Field
                  if (isOtherSelected) ...[
                    const SizedBox(height: 10),
                    TextField(
                      controller: otherReasonController,
                      maxLength: 150,
                      maxLines: 2,
                      style: GoogleFonts.plusJakartaSans(color: textPrimaryColor),
                      decoration: InputDecoration(
                        hintText: 'Please describe your cancellation reason here...',
                        hintStyle: GoogleFonts.plusJakartaSans(color: textSecondaryColor),
                        counterText: '',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppTheme.primaryDark),
                        ),
                      ),
                    ),
                  ],

                  const SizedBox(height: 20),

                  Row(
                    children: [
                      // Keep Booking Button
                      Expanded(
                        child: SizedBox(
                          height: 48,
                          child: OutlinedButton(
                            onPressed: () => Navigator.of(context).pop(),
                            style: OutlinedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text('Keep Booking'),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Confirm Cancellation Button
                      Expanded(
                        child: SizedBox(
                          height: 48,
                          child: ElevatedButton(
                            onPressed: () async {
                              final finalReason = isOtherSelected
                                  ? (otherReasonController.text.trim().isNotEmpty
                                      ? otherReasonController.text.trim()
                                      : 'Other reason')
                                  : selectedReason;

                              Navigator.of(context).pop();

                              final success = await Provider.of<BookingProvider>(context, listen: false)
                                  .cancelBooking(booking.id, reason: finalReason);

                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(success ? 'Booking cancelled successfully' : 'Cancellation failed'),
                                    backgroundColor: success ? AppTheme.primaryDark : AppTheme.error,
                                  ),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.error,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 0,
                            ),
                            child: Text(
                              'Confirm Cancel',
                              style: GoogleFonts.outfit(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // If user is in Demo Mode or Guest (not logged in with a real account), show ONLY Log In & Sign Up options!
    if (!authProvider.isRealUser) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('My Bookings'),
        ),
        body: _buildDemoGuestAuthNotice(context),
      );
    }

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Bookings'),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh_rounded),
              onPressed: () {
                bookingProvider.fetchBookings(userPhone: authProvider.user?.phone);
              },
            ),
          ],
          bottom: TabBar(
            indicatorColor: AppTheme.primary,
            labelColor: AppTheme.primary,
            unselectedLabelColor: isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary,
            labelStyle: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15),
            unselectedLabelStyle: GoogleFonts.outfit(fontWeight: FontWeight.w500, fontSize: 15),
            tabs: const [
              Tab(text: 'Active Bookings'),
              Tab(text: 'History'),
            ],
          ),
        ),
        body: RefreshIndicator(
          onRefresh: () async {
            await bookingProvider.fetchBookings(userPhone: authProvider.user?.phone);
          },
          child: TabBarView(
            children: [
              _buildBookingsList(context, bookingProvider.activeBookings, isHistory: false),
              _buildBookingsList(context, bookingProvider.completedBookings, isHistory: true),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDemoGuestAuthNotice(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.calendar_month_rounded,
                size: 64,
                color: AppTheme.primaryDark,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Sign In to View Bookings',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: textPrimaryColor,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Log in to your account or create a new one to view your active bookings and order history.',
              textAlign: TextAlign.center,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: textSecondaryColor,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 28),
            Row(
              children: [
                // Log In Button
                Expanded(
                  child: SizedBox(
                    height: 50,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (context) => const LoginScreen()),
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
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),

                // Sign Up Button
                Expanded(
                  child: SizedBox(
                    height: 50,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (context) => const RegisterScreen()),
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
                          fontSize: 15,
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
    );
  }

  Widget _buildBookingsList(BuildContext context, List<BookingModel> bookings, {required bool isHistory}) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;

    if (bookingProvider.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (bookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isHistory ? Icons.history_toggle_off_rounded : Icons.calendar_today_rounded,
              size: 64,
              color: textSecondaryColor.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 14),
            Text(
              isHistory ? 'No booking history' : 'No active bookings',
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textPrimaryColor,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              isHistory ? 'Your past bookings will appear here.' : 'Book a service now to get expert help!',
              style: GoogleFonts.plusJakartaSans(
                color: textSecondaryColor,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: bookings.length,
      itemBuilder: (context, index) {
        final booking = bookings[index];
        return _buildBookingCard(context, booking);
      },
    );
  }

  Widget _buildBookingCard(BuildContext context, BookingModel booking) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;

    final isActive = booking.status.toLowerCase() == 'confirmed' || booking.status.toLowerCase() == 'pending';

    // Theme-adaptive non-white active booking background with primary border highlight
    final cardBgColor = isDark
        ? AppTheme.darkSurface
        : (isActive ? const Color(0xFFF1F5F9) : Colors.white);

    final cardBorderColor = isDark
        ? AppTheme.darkBorder
        : (isActive ? AppTheme.primaryDark.withValues(alpha: 0.4) : AppTheme.lightBorder);

    Color statusColor;
    switch (booking.status.toLowerCase()) {
      case 'confirmed':
        statusColor = AppTheme.success;
        break;
      case 'completed':
        statusColor = AppTheme.primaryDark;
        break;
      case 'cancelled':
        statusColor = AppTheme.error;
        break;
      default:
        statusColor = AppTheme.accent;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: cardBorderColor, width: isActive ? 1.5 : 1.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row: Booking ID & Status Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'ID: ${booking.id}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryDark,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  booking.status.toUpperCase(),
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: statusColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Main Info: Service Icon, Name & Date/Time
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.build_rounded, color: AppTheme.primaryDark),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      booking.service.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textPrimaryColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${booking.date}  •  ${booking.timeSlot}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: textSecondaryColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Address Preview
          if (booking.address.isNotEmpty) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Icons.location_on_outlined, size: 14, color: textSecondaryColor),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    booking.address,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: textSecondaryColor,
                    ),
                  ),
                ),
              ],
            ),
          ],

          // Cancellation Reason Badge (If Cancelled)
          if (booking.status.toLowerCase() == 'cancelled' && booking.cancellationReason.isNotEmpty) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.info_outline, size: 14, color: AppTheme.error.withValues(alpha: 0.85)),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    'Reason: ${booking.cancellationReason}',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      fontStyle: FontStyle.italic,
                      color: AppTheme.error.withValues(alpha: 0.9),
                    ),
                  ),
                ),
              ],
            ),
          ],

          Divider(height: 24, color: isDark ? AppTheme.darkBorder : AppTheme.lightBorder),

          // Footer Row: Total Paid & Cancel Button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Total Amount',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: textSecondaryColor,
                    ),
                  ),
                  Text(
                    '₹${booking.totalAmount.toInt()}',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryDark,
                    ),
                  ),
                ],
              ),
              if (isActive)
                OutlinedButton.icon(
                  onPressed: () {
                    _showCancellationReasonModal(context, booking);
                  },
                  icon: const Icon(Icons.cancel_outlined, size: 16),
                  label: const Text('Cancel Order'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.error,
                    side: const BorderSide(color: AppTheme.error),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
