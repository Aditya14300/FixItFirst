import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class BrandLogo extends StatelessWidget {
  final double size;
  final bool showText;
  final double fontSize;

  const BrandLogo({
    super.key,
    this.size = 38,
    this.showText = true,
    this.fontSize = 20,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // FixItFirst Logo Image container
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: Image.asset(
            'assets/images/logo.png',
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              // Fallback network image or brand icon
              return Image.network(
                'https://res.cloudinary.com/dmsgeia9g/image/upload/v1782974140/logo_e536po.png',
                fit: BoxFit.contain,
                errorBuilder: (ctx, err, st) => Container(
                  color: theme.colorScheme.primary,
                  child: const Icon(
                    Icons.build_circle_rounded,
                    color: Color(0xFF0F172A),
                    size: 24,
                  ),
                ),
              );
            },
          ),
        ),
        if (showText) ...[
          const SizedBox(width: 10),
          RichText(
            text: TextSpan(
              style: GoogleFonts.outfit(
                fontSize: fontSize,
                fontWeight: FontWeight.w900,
              ),
              children: [
                TextSpan(
                  text: 'FixIt',
                  style: TextStyle(
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
                TextSpan(
                  text: 'First',
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}
