export default function AdminDashboard() {
  return (
    <div>

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <div className="grid lg:grid-cols-4 gap-6 mt-10">

        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-slate-500">Users</h2>

          <h1 className="text-4xl font-bold mt-3">
            1250
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-slate-500">
            Bookings
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            860
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-slate-500">
            Revenue
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            ₹2.5L
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-slate-500">
            Services
          </h2>

          <h1 className="text-4xl font-bold mt-3">
            32
          </h1>
        </div>

      </div>

    </div>
  );
}