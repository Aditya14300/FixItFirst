import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;
    IconData icon;

    switch (status.toLowerCase()) {
      case 'pending':
        bg = const Color(0xFFFEF3C7); // Amber-100
        fg = const Color(0xFFD97706); // Amber-700
        label = 'Pending Request';
        icon = Icons.schedule_rounded;
        break;
      case 'confirmed':
        bg = const Color(0xFFE0F2FE); // Sky-100
        fg = const Color(0xFF0284C7); // Sky-700
        label = 'Confirmed';
        icon = Icons.event_available_rounded;
        break;
      case 'in_progress':
        bg = const Color(0xFFEDE9FE); // Purple-100
        fg = const Color(0xFF7C3AED); // Purple-700
        label = 'In Progress';
        icon = Icons.autorenew_rounded;
        break;
      case 'completed':
        bg = const Color(0xFFD1FAE5); // Emerald-100
        fg = const Color(0xFF059669); // Emerald-700
        label = 'Completed';
        icon = Icons.check_circle_rounded;
        break;
      case 'cancelled':
        bg = const Color(0xFFFEE2E2); // Red-100
        fg = const Color(0xFFDC2626); // Red-700
        label = 'Cancelled';
        icon = Icons.cancel_rounded;
        break;
      default:
        bg = const Color(0xFFF1F5F9);
        fg = const Color(0xFF64748B);
        label = status;
        icon = Icons.info_outline;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: fg),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: fg,
            ),
          ),
        ],
      ),
    );
  }
}
