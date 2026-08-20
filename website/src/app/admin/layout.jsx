"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const bookings = [
  {
    id: "#BK1001",
    service: "AC Repair",
    date: "15 July 2026",
    status: "Completed",
    price: "₹499",
  },
  {
    id: "#BK1002",
    service: "Plumbing",
    date: "20 July 2026",
    status: "Upcoming",
    price: "₹699",
  },
];

export default function MyBookings() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 py-16">

        <div className="max-w-7xl mx-auto px-6">

          <h1 className="text-4xl font-bold mb-10">
            My Bookings
          </h1>

          <div className="space-y-6">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow p-8 flex justify-between items-center"
              >

                <div>

                  <h2 className="text-2xl font-bold">
                    {booking.service}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Booking ID : {booking.id}
                  </p>

                  <p className="text-slate-500">
                    {booking.date}
                  </p>

                </div>

                <div className="text-right">

                  <h3 className="text-2xl font-bold">
                    {booking.price}
                  </h3>

                  <span className="mt-3 inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                    {booking.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}