# FixItFirst Mobile Application 📱

A modern, production-ready Flutter mobile application for booking home services (Plumbing, Electrical, AC Repair, Cleaning, etc.). Built with dynamic Provider state management, real-time MongoDB synchronization, and robust error handling for hosted cloud backends (Render).

---

## 📂 Project Directory Structure

```text
mobile-app/
├── android/                   # Android native configuration & build settings
├── ios/                       # iOS native configuration & Pods setup
├── test/                      # Automated unit & end-to-end integration tests
│   ├── live_api_test.dart     # Live E2E API test suite against production backend
│   └── widget_test.dart       # Default Flutter widget test
├── lib/                       # Main application source code
│   ├── main.dart              # Application entry point & Provider initialization
│   │
│   ├── core/                  # Design tokens & API configurations
│   │   ├── api_constants.dart # Environment-aware base URLs & API endpoints
│   │   └── app_theme.dart     # Custom color palette, typography & theme system
│   │
│   ├── models/                # Data serialization models
│   │   ├── booking_model.dart  # Booking schema & status parser
│   │   ├── category_model.dart # Service category model
│   │   ├── service_model.dart  # Individual service listing model
│   │   └── user_model.dart     # User profile & authentication schema
│   │
│   ├── providers/             # Provider State Management layer
│   │   ├── auth_provider.dart    # User session, login, register & JWT storage
│   │   ├── booking_provider.dart # Booking creation, fetching & cancellation sync
│   │   └── service_provider.dart # Categories & service catalog filter state
│   │
│   ├── screens/               # Application UI screens
│   │   ├── main_navigation_screen.dart # Bottom navigation bar wrapper
│   │   ├── splash_screen.dart          # Branded animated splash screen
│   │   │
│   │   ├── auth/              # Authentication screens
│   │   │   ├── login_screen.dart        # Customer sign-in screen
│   │   │   ├── register_screen.dart     # Account registration screen
│   │   │   └── welcome_auth_screen.dart # Onboarding welcome screen
│   │   │
│   │   ├── booking/           # Booking management screens
│   │   │   ├── book_service_screen.dart # Date/time slot booking form
│   │   │   └── my_bookings_screen.dart  # Customer active/past booking history
│   │   │
│   │   ├── home/              # Home dashboard
│   │   │   └── home_screen.dart         # Hero banner, categories grid & popular services
│   │   │
│   │   ├── profile/           # Account management
│   │   │   └── profile_screen.dart      # User profile, history & logout
│   │   │
│   │   └── services/          # Service listings & details
│   │       ├── service_detail_screen.dart # Full service breakdown & pricing
│   │       └── services_screen.dart       # Searchable catalog & category filter
│   │
│   ├── services/              # Networking & HTTP layer
│   │   └── api_service.dart   # Central HTTP client (GET, POST, PUT, DELETE) with 60s timeout
│   │
│   └── widgets/               # Reusable UI components
│       └── database_error_widget.dart # Connection error banner & fallback UI
│
├── pubspec.yaml               # Project dependencies & asset declarations
└── README.md                  # Project documentation
```

---

## 🚀 Key Features

- **Production API Integration**: Pre-configured to communicate directly with live Render backend (`https://fixitfirst.onrender.com/api`).
- **Render Cold Start Ready**: Integrated 60-second HTTP request timeout to cleanly handle Render free instance wake-up times.
- **Automated JWT Token Management**: Secure token persistence with `SharedPreferences` and automatic `Bearer` header attachment.
- **Robust Network Error Handling**: Separate handling for `SocketException` (no internet) and `TimeoutException` (server waking up).
- **Instant Demo Sign-In**: Fallback demo mode available for offline demonstration & fast evaluation.

---

## 🛠️ Getting Started

### Prerequisites
- Flutter SDK (`^3.9.2` or later)
- Dart SDK
- Android Studio / VS Code / Xcode (for iOS)

### Installation & Run

1. Navigate to the mobile app directory:
   ```bash
   cd mobile-app
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Run the application:
   ```bash
   flutter run
   ```

4. Run live API integration test suite:
   ```bash
   flutter test test/live_api_test.dart
   ```
