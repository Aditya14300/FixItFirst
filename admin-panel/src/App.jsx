import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from './components/layout/AdminSidebar';
import AdminHeader from './components/layout/AdminHeader';
import DashboardView from './pages/DashboardView';
import CategoriesView from './pages/CategoriesView';
import ServicesView from './pages/ServicesView';
import BookingsView from './pages/BookingsView';
import CustomersView from './pages/CustomersView';
import TechniciansView from './pages/TechniciansView';
import { getCategories, getServices, getBookings, getUsers, getStaff } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLiveData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [catData, srvData, bkgData, usrData, stfData] = await Promise.all([
        getCategories(),
        getServices(),
        getBookings(),
        getUsers(),
        getStaff(),
      ]);
      setCategories(catData);
      setServices(srvData);
      setBookings(bkgData);
      setUsers(usrData);
      setStaff(stfData);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLiveData(true);
  }, [fetchLiveData]);

  // Real-time live background polling (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  const tabTitles = {
    dashboard: 'Dashboard Overview',
    categories: 'Categories Directory',
    services: 'Service Catalog & Pricing',
    bookings: 'Service Orders & Dispatches',
    customers: 'Registered Customers Directory',
    technicians: 'Field Technicians Roster',
  };

  return (
    <div className="flex min-h-screen bg-[#030712] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={tabTitles[activeTab]}
          activeTab={activeTab}
          onRefresh={() => fetchLiveData(false)}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="h-10 w-10 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-400">Syncing with MongoDB Database...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  bookings={bookings}
                  services={services}
                  categories={categories}
                  users={users}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'categories' && (
                <CategoriesView categories={categories} setCategories={setCategories} />
              )}
              {activeTab === 'services' && (
                <ServicesView services={services} setServices={setServices} categories={categories} />
              )}
              {activeTab === 'bookings' && (
                <BookingsView bookings={bookings} setBookings={setBookings} />
              )}
              {activeTab === 'customers' && (
                <CustomersView users={users} bookings={bookings} />
              )}
              {activeTab === 'technicians' && <TechniciansView staff={staff} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
