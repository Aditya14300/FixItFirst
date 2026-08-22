import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../main_navigation_screen.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _isFormValid = false;

  @override
  void initState() {
    super.initState();
    _nameController.addListener(_checkFormValidation);
    _phoneController.addListener(_checkFormValidation);
    _emailController.addListener(_checkFormValidation);
    _passwordController.addListener(_checkFormValidation);
  }

  @override
  void dispose() {
    _nameController.removeListener(_checkFormValidation);
    _phoneController.removeListener(_checkFormValidation);
    _emailController.removeListener(_checkFormValidation);
    _passwordController.removeListener(_checkFormValidation);

    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _checkFormValidation() {
    final nameVal = _nameController.text.trim();
    final phoneVal = _phoneController.text.trim();
    final emailVal = _emailController.text.trim();
    final passwordVal = _passwordController.text;

    final isNameValid = nameVal.isNotEmpty;
    final isPhoneValid = RegExp(r'^\d{10}$').hasMatch(phoneVal);
    final isEmailValid = emailVal.isNotEmpty && RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(emailVal);
    final isPasswordValid = passwordVal.length >= 6;

    final isValid = isNameValid && isPhoneValid && isEmailValid && isPasswordValid;

    if (isValid != _isFormValid) {
      setState(() {
        _isFormValid = isValid;
      });
    }
  }

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final success = await authProvider.register(
        name: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );

      if (mounted) {
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Account created! Welcome to FixitFirst.'),
              backgroundColor: AppTheme.success,
            ),
          );
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const MainNavigationScreen()),
            (route) => false,
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(authProvider.errorMessage ?? 'Registration failed.'),
              backgroundColor: AppTheme.error,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Account'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Join FixitFirst ✨',
                  style: GoogleFonts.outfit(
                    fontSize: 30,
                    fontWeight: FontWeight.w900,
                  ),
                ).animate().fadeIn().slideY(begin: -0.1),
                const SizedBox(height: 8),
                Text(
                  'Create your account to book trusted home repair specialists.',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 15,
                    color: isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary,
                  ),
                ).animate().fadeIn(delay: 100.ms),
                const SizedBox(height: 28),

                // Name Input
                Text(
                  'Full Name *',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _nameController,
                  maxLength: 50,
                  inputFormatters: [LengthLimitingTextInputFormatter(50)],
                  decoration: const InputDecoration(
                    hintText: 'John Doe',
                    counterText: '',
                    prefixIcon: Icon(Icons.person_outline_rounded),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter your full name';
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 200.ms),
                const SizedBox(height: 18),

                // Phone Input (Strict 10 Digits)
                Text(
                  'Mobile Number *',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  maxLength: 10,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(10),
                  ],
                  decoration: const InputDecoration(
                    hintText: 'Enter 10-digit mobile number',
                    counterText: '',
                    prefixIcon: Icon(Icons.phone_android_rounded),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().length != 10) {
                      return 'Mobile number must be exactly 10 digits';
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 300.ms),
                const SizedBox(height: 18),

                // Email Input
                Text(
                  'Email Address *',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  maxLength: 80,
                  inputFormatters: [LengthLimitingTextInputFormatter(80)],
                  decoration: const InputDecoration(
                    hintText: 'john@example.com',
                    counterText: '',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter email address';
                    }
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value.trim())) {
                      return 'Please enter a valid email address';
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 400.ms),
                const SizedBox(height: 18),

                // Password Input
                Text(
                  'Password *',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  maxLength: 50,
                  inputFormatters: [LengthLimitingTextInputFormatter(50)],
                  decoration: InputDecoration(
                    hintText: 'Create password (min 6 characters)',
                    counterText: '',
                    prefixIcon: const Icon(Icons.lock_outline_rounded),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 500.ms),
                const SizedBox(height: 32),

                // Create Account Button (Disabled until ALL mandatory fields are correctly filled)
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    onPressed: (_isFormValid && !authProvider.isLoading) ? _handleRegister : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: const Color(0xFF0F172A),
                      disabledBackgroundColor: isDark ? AppTheme.darkBorder : Colors.grey.shade300,
                      disabledForegroundColor: isDark ? AppTheme.textDarkSecondary : Colors.grey.shade600,
                    ),
                    child: authProvider.isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              color: Color(0xFF0F172A),
                              strokeWidth: 2.5,
                            ),
                          )
                        : Text(
                            'Create Account',
                            style: GoogleFonts.outfit(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                  ),
                ).animate().fadeIn(delay: 600.ms).scale(),
                const SizedBox(height: 24),

                // Sign In Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Already have an account? ",
                      style: GoogleFonts.plusJakartaSans(
                        color: isDark ? AppTheme.textDarkSecondary : AppTheme.textLightSecondary,
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(builder: (context) => const LoginScreen()),
                        );
                      },
                      child: Text(
                        'Sign In',
                        style: GoogleFonts.plusJakartaSans(
                          color: AppTheme.primaryDark,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 700.ms),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
