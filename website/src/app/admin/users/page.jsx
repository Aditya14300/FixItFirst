"use client";

import { Search, Plus } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    phone: "9876543210",
    role: "Customer",
    status: "Active",
  },
  {
    id: 2,
    name: "Amit Das",
    email: "amit@gmail.com",
    phone: "9999999999",
    role: "Technician",
    status: "Active",
  },
];

export default function UsersPage() {
  return (
    <div>

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold">
          Users
        </h1>

        <button className="bg-yellow-400 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-yellow-500">

          <Plus size={18} />

          Add User

        </button>

      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-6">

        <div className="flex items-center border rounded-xl px-4">

          <Search />

          <input
            placeholder="Search users..."
            className="w-full p-3 outline-none"
          />

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Phone</th>

              <th className="p-4 text-left">Role</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-4">{user.name}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">{user.phone}</td>

                <td className="p-4">{user.role}</td>

                <td className="p-4">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                    {user.status}

                  </span>

                </td>

                <td className="p-4 space-x-3">

                  <button className="text-blue-600">
                    Edit
                  </button>

                  <button className="text-red-600">
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}