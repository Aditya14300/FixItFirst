import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../models/service_model.dart';
import '../../providers/address_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/booking_provider.dart';
import '../auth/register_screen.dart';
import '../main_navigation_screen.dart';

class BookServiceScreen extends StatefulWidget {
  final ServiceModel service;

  const BookServiceScreen({super.key, required this.service});

  @override
  State<BookServiceScreen> createState() => _BookServiceScreenState();
}

class _BookServiceScreenState extends State<BookServiceScreen> {
  final _formKey = GlobalKey<FormState>();
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  String _selectedTimeSlot = 'Full Day (09:00 AM - 07:00 PM)';
  final _addressController = TextEditingController();
  final _notesController = TextEditingController();

  bool _isChangingAddress = false;

  final List<Map<String, String>> _timeSlots = [
    {
      'title': 'Full Day',
      'timing': '09:00 AM - 07:00 PM',
    },
    {
      'title': 'First Hours',
      'timing': '09:00 AM - 01:00 PM',
    },
    {
      'title': 'Second Hours',
      'timing': '02:00 PM - 06:00 PM',
    },
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final addressProvider = Provider.of<AddressProvider>(context, listen: false);

      if (!authProvider.isAuthenticated) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please create an account to book your service.'),
            backgroundColor: AppTheme.primary,
            duration: Duration(seconds: 3),
          ),
        );
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const RegisterScreen()),
        );
        return;
      }

      // Check if user already has an address saved in database users collection
      final dbUserAddress = authProvider.user?.address.trim() ?? '';
      final savedAddress = addressProvider.defaultAddress?.fullAddress ?? '';

      final initialAddress = dbUserAddress.isNotEmpty ? dbUserAddress : savedAddress;

      if (initialAddress.isNotEmpty && _addressController.text.isEmpty) {
        setState(() {
          _addressController.text = initialAddress;
        });
      }
    });
  }

  @override
  void dispose() {
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  List<DateTime> _generate6Dates() {
    final now = DateTime.now();
    return List.generate(6, (index) => now.add(Duration(days: index)));
  }

  void _handleConfirmBooking() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final bookingProvider = Provider.of<BookingProvider>(context, listen: false);

      if (!authProvider.isAuthenticated) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please create an account to book your service.'),
            backgroundColor: AppTheme.primary,
            duration: Duration(seconds: 3),
          ),
        );
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const RegisterScreen()),
        );
        return;
      }

      final enteredAddress = _addressController.text.trim();

      final success = await bookingProvider.createBooking(
        service: widget.service,
        user: authProvider.user,
        date: DateFormat('yyyy-MM-dd').format(_selectedDate),
        timeSlot: _selectedTimeSlot,
        address: enteredAddress,
        notes: _notesController.text.trim(),
      );

      if (mounted) {
        if (success) {
          // Update address column in users collection in MongoDB and local session
          await authProvider.updateUserAddress(enteredAddress);
          _showSuccessDialog();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(bookingProvider.error ?? 'Booking failed'),
              backgroundColor: AppTheme.error,
            ),
          );
        }
      }
    }
  }

  void _showSuccessDialog() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: isDark ? AppTheme.darkSurface : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppTheme.success,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_rounded, size: 48, color: Colors.white),
            ),
            const SizedBox(height: 20),
            Text(
              'Booking Confirmed!',
              style: GoogleFonts.outfit(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: textPrimaryColor,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Your service for ${widget.service.name} has been booked for ${DateFormat('EEE, MMM d').format(_selectedDate)} (${_selectedTimeSlot.split(' ')[0]}).',
              textAlign: TextAlign.center,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: textSecondaryColor,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => const MainNavigationScreen()),
                    (route) => false,
                  );
                },
                child: const Text('Go to My Bookings'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _build6DateSquareGrid(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;
    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    final dates = _generate6Dates();

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1.15,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: 6,
      itemBuilder: (context, index) {
        final date = dates[index];
        final isSelected = DateFormat('yyyy-MM-dd').format(_selectedDate) ==
            DateFormat('yyyy-MM-dd').format(date);

        String dayLabel;
        if (index == 0) {
          dayLabel = 'Today';
        } else if (index == 1) {
          dayLabel = 'Tomorrow';
        } else {
          dayLabel = DateFormat('EEE').format(date);
        }

        final dayNum = DateFormat('dd').format(date);
        final monthStr = DateFormat('MMM').format(date);

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedDate = date;
            });
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
              color: isSelected ? AppTheme.primary : cardBgColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isSelected ? AppTheme.primaryDark : cardBorderColor,
                width: isSelected ? 2.0 : 1.0,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: AppTheme.primary.withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      )
                    ]
                  : [],
            ),
            child: Stack(
              children: [
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        dayLabel.toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? const Color(0xFF0F172A) : AppTheme.primaryDark,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        dayNum,
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: isSelected ? const Color(0xFF0F172A) : textPrimaryColor,
                        ),
                      ),
                      Text(
                        monthStr,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: isSelected ? const Color(0xFF0F172A) : textSecondaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
                if (isSelected)
                  Positioned(
                    top: 6,
                    right: 6,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Color(0xFF0F172A),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.check,
                        size: 10,
                        color: Colors.white,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _build3TimeSlotOptions(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;
    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    return Column(
      children: _timeSlots.map((slot) {
        final slotValue = '${slot['title']} (${slot['timing']})';
        final isSelected = _selectedTimeSlot == slotValue;

        IconData iconData;
        if (slot['title'] == 'Full Day') {
          iconData = Icons.wb_sunny_rounded;
        } else if (slot['title'] == 'First Hours') {
          iconData = Icons.wb_twilight_rounded;
        } else {
          iconData = Icons.nights_stay_rounded;
        }

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedTimeSlot = slotValue;
            });
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isSelected
                  ? (isDark ? AppTheme.darkSurface : AppTheme.primary.withValues(alpha: 0.12))
                  : cardBgColor,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isSelected ? AppTheme.primaryDark : cardBorderColor,
                width: isSelected ? 2.0 : 1.0,
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppTheme.primary
                        : AppTheme.primary.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    iconData,
                    size: 20,
                    color: isSelected ? const Color(0xFF0F172A) : AppTheme.primaryDark,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        slot['title']!,
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: textPrimaryColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        slot['timing']!,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: isSelected ? AppTheme.primaryDark : textSecondaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
                Radio<String>(
                  value: slotValue,
                  groupValue: _selectedTimeSlot,
                  activeColor: AppTheme.primaryDark,
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        _selectedTimeSlot = value;
                      });
                    }
                  },
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final textPrimaryColor = isDark ? AppTheme.textDarkPrimary : AppTheme.textLightPrimary;
    final textSecondaryColor = isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary;
    final cardBgColor = isDark ? AppTheme.darkSurface : Colors.white;
    final cardBorderColor = isDark ? AppTheme.darkBorder : AppTheme.lightBorder;

    final hasUserAddressInDb = authProvider.user?.address.trim().isNotEmpty == true;
    final hasCurrentAddressText = _addressController.text.trim().isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Schedule Service'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Summary Banner
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.darkSurface : AppTheme.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? AppTheme.darkBorder : AppTheme.primary.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.build_circle_rounded, color: AppTheme.primaryDark, size: 36),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.service.name,
                            style: GoogleFonts.outfit(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: textPrimaryColor,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Amount: ₹${widget.service.finalPrice.toInt()}',
                            style: GoogleFonts.plusJakartaSans(
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primaryDark,
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Date Picker Header with Calendar Button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Select Date',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textPrimaryColor,
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: _selectedDate,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 30)),
                      );
                      if (picked != null) {
                        setState(() {
                          _selectedDate = picked;
                        });
                      }
                    },
                    icon: const Icon(Icons.calendar_month_outlined, size: 16),
                    label: const Text('More Dates'),
                    style: TextButton.styleFrom(
                      foregroundColor: AppTheme.primaryDark,
                      padding: EdgeInsets.zero,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // 6 Date Interactive Square Grid
              _build6DateSquareGrid(context),
              const SizedBox(height: 24),

              // 3 Time Slot Options (Full Day, First Hours, Second Hours)
              Text(
                'Select Time Slot',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textPrimaryColor,
                ),
              ),
              const SizedBox(height: 10),
              _build3TimeSlotOptions(context),
              const SizedBox(height: 24),

              // Service Address Section
              if (hasCurrentAddressText && !_isChangingAddress) ...[
                // Highlighted Saved Address Card (User can go with previous address or change it)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? AppTheme.darkSurface : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppTheme.darkBorder : AppTheme.primaryDark.withValues(alpha: 0.4),
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.location_on_rounded, color: AppTheme.primaryDark, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                'Service Address',
                                style: GoogleFonts.outfit(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: textPrimaryColor,
                                ),
                              ),
                            ],
                          ),
                          TextButton.icon(
                            onPressed: () {
                              setState(() {
                                _isChangingAddress = true;
                              });
                            },
                            icon: const Icon(Icons.edit_location_alt_outlined, size: 16),
                            label: const Text('Change Address'),
                            style: TextButton.styleFrom(
                              foregroundColor: AppTheme.primaryDark,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          hasUserAddressInDb ? 'Saved Address (From Database)' : 'Current Address',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryDark,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _addressController.text,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: textPrimaryColor,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ] else ...[
                // Address Input Field (If user doesn't have address or clicked Change Address)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Service Address',
                      style: GoogleFonts.outfit(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textPrimaryColor,
                      ),
                    ),
                    if (hasCurrentAddressText)
                      TextButton(
                        onPressed: () {
                          setState(() {
                            _isChangingAddress = false;
                          });
                        },
                        child: const Text('Use Saved Address'),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Address will be saved to your profile in database upon booking.',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    color: textSecondaryColor,
                  ),
                ),
                const SizedBox(height: 8),

                // Saved Address Quick Selector Chips
                Consumer<AddressProvider>(
                  builder: (context, addressProvider, _) {
                    if (addressProvider.addresses.isEmpty) return const SizedBox.shrink();

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: addressProvider.addresses.map((savedAddr) {
                            final isSelected = _addressController.text.trim() == savedAddr.fullAddress.trim();
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ActionChip(
                                avatar: Icon(
                                  savedAddr.tag == 'Home'
                                      ? Icons.home_rounded
                                      : savedAddr.tag == 'Work'
                                          ? Icons.work_rounded
                                          : Icons.location_on_rounded,
                                  size: 16,
                                  color: isSelected ? const Color(0xFF0F172A) : AppTheme.primaryDark,
                                ),
                                label: Text(savedAddr.tag),
                                backgroundColor: isSelected ? AppTheme.primary : cardBgColor,
                                labelStyle: GoogleFonts.plusJakartaSans(
                                  color: isSelected ? const Color(0xFF0F172A) : textPrimaryColor,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                  fontSize: 13,
                                ),
                                side: BorderSide(
                                  color: isSelected ? AppTheme.primary : cardBorderColor,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _addressController.text = savedAddr.fullAddress;
                                    _isChangingAddress = false;
                                  });
                                },
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    );
                  },
                ),
                TextFormField(
                  controller: _addressController,
                  maxLines: 2,
                  maxLength: 150,
                  inputFormatters: [LengthLimitingTextInputFormatter(150)],
                  decoration: const InputDecoration(
                    hintText: 'House/Flat No., Building, Street address',
                    counterText: '',
                    prefixIcon: Padding(
                      padding: EdgeInsets.only(bottom: 24),
                      child: Icon(Icons.home_outlined, color: AppTheme.textSecondary),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter service address';
                    }
                    return null;
                  },
                ),
              ],
              const SizedBox(height: 20),

              // Additional Notes Input
              Text(
                'Additional Instructions (Optional)',
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: textPrimaryColor,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _notesController,
                maxLength: 250,
                inputFormatters: [LengthLimitingTextInputFormatter(250)],
                decoration: const InputDecoration(
                  hintText: 'e.g. Call before arrival, ladder needed',
                  counterText: '',
                ),
              ),
              const SizedBox(height: 36),

              // Confirm Button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: bookingProvider.isSubmitting ? null : _handleConfirmBooking,
                  child: bookingProvider.isSubmitting
                      ? const CircularProgressIndicator(color: Color(0xFF0F172A))
                      : const Text('Confirm & Book Now'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
