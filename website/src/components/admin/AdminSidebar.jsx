"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Grid2X2,
  CalendarDays,
  CreditCard,
  Star,
  Settings,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/admin",
  },
  {
    name: "Users",
    icon: Users,
    link: "/admin/users",
  },
  {
    name: "Categories",
    icon: Grid2X2,
    link: "/admin/categories",
  },
  {
    name: "Services",
    icon: BriefcaseBusiness,
    link: "/admin/services",
  },
  {
    name: "Bookings",
    icon: CalendarDays,
    link: "/admin/bookings",
  },
  {
    name: "Payments",
    icon: CreditCard,
    link: "/admin/payments",
  },
  {
    name: "Reviews",
    icon: Star,
    link: "/admin/reviews",
  },
  {
    name: "Settings",
    icon: Settings,
    link: "/admin/settings",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-slate-950 text-white min-h-screen p-6">

      <h1 className="text-3xl font-bold text-yellow-400 mb-12">
        FixitFirst
      </h1>

      <div className="space-y-2">

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.link}
              className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </Link>
          );
        })}

      </div>

    </aside>
  );
}