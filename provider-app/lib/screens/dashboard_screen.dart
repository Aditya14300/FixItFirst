import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/job_provider.dart';
import '../widgets/stat_card.dart';
import '../widgets/job_card.dart';
import '../widgets/brand_logo.dart';
import 'job_details_screen.dart';
import 'server_error_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final authProvider = Provider.of<AuthProvider>(context);
    final jobProvider = Provider.of<JobProvider>(context);

    // If app is not connected to server/database, display Error Handling Screen
    if (!jobProvider.isServerConnected) {
      return ServerErrorScreen(
        onRetry: () => jobProvider.fetchBookings(),
        onContinueOffline: () => jobProvider.enableDemoMode(),
      );
    }

    final user = authProvider.user;
    final isOnline = user?.isOnline ?? true;
    final pendingJobs = jobProvider.pendingJobs;
    final activeJobs = jobProvider.activeJobs;
    final earnings = jobProvider.earningsSummary;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        toolbarHeight: 65,
        title: const BrandLogo(size: 36, fontSize: 20),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => jobProvider.fetchBookings(),
            tooltip: 'Sync Server',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => jobProvider.fetchBookings(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Online / Offline Duty Switch Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isOnline
                        ? (isDark
                            ? [const Color(0xFF0F291E), const Color(0xFF064E3B)]
                            : [const Color(0xFFECFDF5), const Color(0xFFD1FAE5)])
                        : (isDark
                            ? [const Color(0xFF2E1010), const Color(0xFF451A1A)]
                            : [const Color(0xFFFEF2F2), const Color(0xFFFEE2E2)]),
                  ),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: isOnline ? const Color(0xFF10B981) : Colors.redAccent,
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isOnline ? 'Partner Status: ONLINE' : 'Partner Status: OFFLINE',
                            style: GoogleFonts.outfit(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: isOnline ? const Color(0xFF10B981) : Colors.redAccent,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            isOnline
                                ? 'You are receiving real-time customer job requests.'
                                : 'Turn status ON to start receiving job offers nearby.',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              color: theme.textTheme.bodyMedium?.color,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Switch(
                      value: isOnline,
                      onChanged: (_) => authProvider.toggleOnlineStatus(),
                      activeTrackColor: const Color(0xFF10B981),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Overview Section Title
              Text(
                'Performance Overview',
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: theme.textTheme.titleLarge?.color,
                ),
              ),

              const SizedBox(height: 14),

              // Stat Cards Grid
              GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
                childAspectRatio: 1.35,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  StatCard(
                    title: 'Today Earnings',
                    value: '\$${earnings.todayEarnings.toStringAsFixed(2)}',
                    icon: Icons.payments_rounded,
                    iconColor: const Color(0xFF10B981),
                    iconBgColor: const Color(0xFF10B981).withValues(alpha: 0.15),
                    subtitle: '+14%',
                  ),
                  StatCard(
                    title: 'Pending Requests',
                    value: '${pendingJobs.length}',
                    icon: Icons.notifications_active_rounded,
                    iconColor: const Color(0xFFF59E0B),
                    iconBgColor: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                    subtitle: 'Action',
                  ),
                  StatCard(
                    title: 'Active Jobs',
                    value: '${activeJobs.length}',
                    icon: Icons.engineering_rounded,
                    iconColor: const Color(0xFF0EA5E9),
                    iconBgColor: const Color(0xFF0EA5E9).withValues(alpha: 0.15),
                  ),
                  StatCard(
                    title: 'Completed Jobs',
                    value: '${earnings.totalJobsCompleted}',
                    icon: Icons.check_circle_rounded,
                    iconColor: const Color(0xFF8B5CF6),
                    iconBgColor: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
                    subtitle: 'Rating 4.9⭐',
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Pending Requests Header
              if (pendingJobs.isNotEmpty) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'New Job Requests (${pendingJobs.length})',
                      style: GoogleFonts.outfit(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: theme.textTheme.titleLarge?.color,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.amber.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'Urgent',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.amber[800],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Pending Jobs list
                ...pendingJobs.map(
                  (job) => JobCard(
                    booking: job,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => JobDetailsScreen(bookingId: job.id),
                        ),
                      );
                    },
                    onAction: (action) {
                      if (action == 'accept') {
                        jobProvider.acceptJob(job.id);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Accepted job: ${job.serviceName}')),
                        );
                      } else if (action == 'decline') {
                        jobProvider.declineJob(job.id);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Declined job request')),
                        );
                      }
                    },
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Active Jobs Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Active Jobs In Progress',
                    style: GoogleFonts.outfit(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: theme.textTheme.titleLarge?.color,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              if (activeJobs.isEmpty)
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: theme.cardTheme.color,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                    ),
                  ),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(
                          Icons.task_alt_rounded,
                          size: 40,
                          color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.5),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'No active jobs right now',
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: theme.textTheme.bodyLarge?.color,
                          ),
                        ),
                        Text(
                          'Accept pending requests above to start working.',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            color: theme.textTheme.bodyMedium?.color,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              else
                ...activeJobs.map(
                  (job) => JobCard(
                    booking: job,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => JobDetailsScreen(bookingId: job.id),
                        ),
                      );
                    },
                    onAction: (action) {
                      if (action == 'start') {
                        jobProvider.updateJobStatus(job.id, 'in_progress');
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Job status updated to In Progress')),
                        );
                      } else if (action == 'complete') {
                        jobProvider.updateJobStatus(job.id, 'completed');
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('🎉 Job marked as Completed! Payment added to wallet.'),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      }
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
