# FixItFirst - On-Demand Home Services Platform 🛠️

FixItFirst is a full-stack, multi-platform ecosystem for booking and managing local home services (Plumbing, Electrical, AC Repair, Cleaning, Appliance Maintenance, Carpentry, etc.).

---

## 🏗️ Repository Architecture & File Structure

```text
FixItFirst/
├── admin-panel/      # Admin Management Dashboard (React / Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/          # RESTful Backend API (Node.js / Express / MongoDB)
│   ├── src/
│   │   ├── config/   # Database & environment connection setup
│   │   ├── controllers/ # Auth, Booking, Category, Service & User logic
│   │   ├── middleware/  # JWT auth & error handling middleware
│   │   ├── models/      # Mongoose schemas (User, Staff, Service, Booking)
│   │   ├── routes/      # Express API route declarations
│   │   ├── app.js       # App configuration & middleware
│   │   └── server.js    # Entry point & port listener
│   └── package.json
│
├── mobile-app/       # Customer Mobile Application (Flutter)
│   ├── lib/
│   │   ├── core/       # API constants & AppTheme design tokens
│   │   ├── models/     # Data serialization models
│   │   ├── providers/  # Provider state management (Auth, Service, Booking)
│   │   ├── screens/    # Customer UI screens (Auth, Home, Catalog, Bookings, Profile)
│   │   └── services/   # Central HTTP client with 60s timeout for Render
│   ├── test/           # Live E2E API test suite
│   └── pubspec.yaml
│
├── provider-app/     # Service Provider / Technician App (Flutter)
│   ├── lib/
│   │   ├── core/       # API constants & theme configurations
│   │   ├── models/     # Provider, Job & Earnings models
│   │   ├── providers/  # Auth, Job & Earnings state management
│   │   └── screens/    # Dashboard, Job Management & Earnings UI
│   └── pubspec.yaml
│
├── website/          # Public Web Portal & Landing Page (Next.js)
│   ├── src/
│   │   ├── app/        # Next.js App Router pages
│   │   └── components/ # Navigation, Hero, Service & Booking components
│   └── package.json
│
└── structure.txt     # System architecture overview
```

---

## 🌐 Live Production Deployments

- **Backend Production Server**: `https://fixitfirst.onrender.com/api`
- **GitHub Repository**: [https://github.com/Aditya14300/FixItFirst.git](https://github.com/Aditya14300/FixItFirst.git)

---

## 🚀 Modules Overview

1. **Backend (`backend/`)**: Express API with JWT authentication, Mongoose ORM, and Render cloud deployment compatibility.
2. **Mobile App (`mobile-app/`)**: Flutter app for customers to discover services, select time slots, and track real-time bookings.
3. **Provider App (`provider-app/`)**: Flutter app for service technicians to receive job alerts, update statuses, and view earnings.
4. **Website (`website/`)**: Next.js web application for online service discovery and direct web bookings.
5. **Admin Panel (`admin-panel/`)**: Management console for monitoring users, approving staff, and tracking platform metrics.
