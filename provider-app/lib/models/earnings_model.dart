class PayoutItem {
  final String id;
  final String date;
  final double amount;
  final String status; // 'Paid', 'Processing', 'Pending'

  PayoutItem({
    required this.id,
    required this.date,
    required this.amount,
    required this.status,
  });
}

class EarningsSummary {
  final double todayEarnings;
  final double weeklyEarnings;
  final double monthlyEarnings;
  final double totalEarnings;
  final int completedJobsToday;
  final int totalJobsCompleted;
  final double pendingPayout;
  final List<PayoutItem> recentPayouts;

  EarningsSummary({
    required this.todayEarnings,
    required this.weeklyEarnings,
    required this.monthlyEarnings,
    required this.totalEarnings,
    required this.completedJobsToday,
    required this.totalJobsCompleted,
    required this.pendingPayout,
    required this.recentPayouts,
  });

  static EarningsSummary sample() {
    return EarningsSummary(
      todayEarnings: 2450.00,
      weeklyEarnings: 14200.00,
      monthlyEarnings: 58900.00,
      totalEarnings: 184500.00,
      completedJobsToday: 4,
      totalJobsCompleted: 42,
      pendingPayout: 3150.00,
      recentPayouts: [
        PayoutItem(id: 'PAY-8921', date: 'Yesterday, 6:30 PM', amount: 3200.00, status: 'Paid'),
        PayoutItem(id: 'PAY-8840', date: '11 Aug 2026', amount: 4500.00, status: 'Paid'),
        PayoutItem(id: 'PAY-8712', date: '08 Aug 2026', amount: 2800.00, status: 'Paid'),
        PayoutItem(id: 'PAY-8604', date: '04 Aug 2026', amount: 3900.00, status: 'Paid'),
      ],
    );
  }
}
