import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/job_provider.dart';
import '../widgets/job_card.dart';
import 'job_details_screen.dart';
import 'server_error_screen.dart';

class JobsScreen extends StatefulWidget {
  const JobsScreen({super.key});

  @override
  State<JobsScreen> createState() => _JobsScreenState();
}

class _JobsScreenState extends State<JobsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final jobProvider = Provider.of<JobProvider>(context);

    if (!jobProvider.isServerConnected) {
      return ServerErrorScreen(
        onRetry: () => jobProvider.fetchBookings(),
        onContinueOffline: () => jobProvider.enableDemoMode(),
      );
    }

    final filteredList = jobProvider.filteredBookings.where((booking) {
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return booking.serviceName.toLowerCase().contains(q) ||
          booking.customerName.toLowerCase().contains(q) ||
          booking.address.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'My Job Assignments',
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          // Filter Tabs Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _filterChip('all', 'All Jobs (${jobProvider.bookings.length})'),
                  const SizedBox(width: 8),
                  _filterChip(
                    'pending',
                    'Requests (${jobProvider.pendingJobs.length})',
                    badgeColor: Colors.amber[700],
                  ),
                  const SizedBox(width: 8),
                  _filterChip(
                    'active',
                    'Active (${jobProvider.activeJobs.length})',
                    badgeColor: const Color(0xFF0EA5E9),
                  ),
                  const SizedBox(width: 8),
                  _filterChip(
                    'completed',
                    'Completed (${jobProvider.completedJobs.length})',
                    badgeColor: const Color(0xFF10B981),
                  ),
                ],
              ),
            ),
          ),

          // Search Field
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              style: GoogleFonts.plusJakartaSans(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search by service, customer name or address...',
                prefixIcon: const Icon(Icons.search_rounded, size: 20),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),

          // Jobs List
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => jobProvider.fetchBookings(),
              child: filteredList.isEmpty
                  ? Center(
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.assignment_late_outlined,
                              size: 56,
                              color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.4),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No Jobs Found',
                              style: GoogleFonts.outfit(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: theme.textTheme.bodyLarge?.color,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'There are no service assignments matching your filter.',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 13,
                                color: theme.textTheme.bodyMedium?.color,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: filteredList.length,
                      itemBuilder: (context, index) {
                        final job = filteredList[index];
                        return JobCard(
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
                            } else if (action == 'decline') {
                              jobProvider.declineJob(job.id);
                            } else if (action == 'start') {
                              jobProvider.updateJobStatus(job.id, 'in_progress');
                            } else if (action == 'complete') {
                              jobProvider.updateJobStatus(job.id, 'completed');
                            }
                          },
                        );
                      },
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _filterChip(String filterKey, String label, {Color? badgeColor}) {
    final theme = Theme.of(context);
    final jobProvider = Provider.of<JobProvider>(context);
    final isSelected = jobProvider.selectedFilter == filterKey;

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: theme.colorScheme.primary,
      backgroundColor: theme.cardTheme.color,
      labelStyle: GoogleFonts.plusJakartaSans(
        fontSize: 13,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
        color: isSelected
            ? const Color(0xFF0F172A)
            : theme.textTheme.bodyLarge?.color,
      ),
      onSelected: (_) => jobProvider.setFilter(filterKey),
    );
  }
}
