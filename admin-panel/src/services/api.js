import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const getCategories = async () => {
  try {
    const res = await api.get('/categories');
    return res.data.categories || [];
  } catch (err) {
    console.warn('Backend API offline, using fallback categories data:', err.message);
    return [
      { _id: 'cat1', name: 'Plumbing', description: 'Pipes, faucets & leak fixes', icon: 'Wrench', isActive: true },
      { _id: 'cat2', name: 'Electrical', description: 'Wiring, switches & circuit repair', icon: 'Zap', isActive: true },
      { _id: 'cat3', name: 'AC Repair', description: 'AC jet service & gas refilling', icon: 'Wind', isActive: true },
      { _id: 'cat4', name: 'Appliance', description: 'Washing machine & fridge repair', icon: 'Tv', isActive: true },
      { _id: 'cat5', name: 'Carpentry', description: 'Furniture assembly & door fixing', icon: 'Hammer', isActive: true },
      { _id: 'cat6', name: 'Cleaning', description: 'Deep home & sofa cleaning', icon: 'Sparkles', isActive: true },
    ];
  }
};

export const createCategory = async (data) => {
  try {
    const res = await api.post('/categories', data);
    return res.data.category;
  } catch (err) {
    return { _id: `cat-${Date.now()}`, ...data, isActive: true };
  }
};

export const getServices = async () => {
  try {
    const res = await api.get('/services');
    return res.data.services || [];
  } catch (err) {
    console.warn('Backend API offline, using fallback services data:', err.message);
    return [
      {
        _id: 'srv1',
        name: 'AC Deep Service & Jet Wash',
        category: { _id: 'cat3', name: 'AC Repair' },
        description: 'Complete jet wash of indoor & outdoor unit with pressure check.',
        price: 999,
        discountPrice: 799,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
        isActive: true,
      },
      {
        _id: 'srv2',
        name: 'Tap & Pipe Leak Repair',
        category: { _id: 'cat1', name: 'Plumbing' },
        description: 'Fixing water leaks, pipe joint sealing, and tap replacement.',
        price: 499,
        discountPrice: 349,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500',
        isActive: true,
      },
      {
        _id: 'srv3',
        name: 'Ceiling Fan Installation & Fix',
        category: { _id: 'cat2', name: 'Electrical' },
        description: 'New fan hanging, regulator replacement, and capacitor fixing.',
        price: 399,
        discountPrice: 299,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=500',
        isActive: true,
      },
      {
        _id: 'srv4',
        name: 'Full House Deep Cleaning',
        category: { _id: 'cat6', name: 'Cleaning' },
        description: 'Professional deep cleaning of bedrooms, kitchen, and floor scrubbing.',
        price: 2999,
        discountPrice: 2499,
        duration: 180,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
        isActive: true,
      },
    ];
  }
};

export const createService = async (data) => {
  try {
    const res = await api.post('/services', data);
    return res.data.service;
  } catch (err) {
    return { _id: `srv-${Date.now()}`, ...data, isActive: true };
  }
};

export const deleteService = async (id) => {
  try {
    await api.delete(`/services/${id}`);
    return true;
  } catch (err) {
    return true;
  }
};

export const getBookings = async () => {
  try {
    const res = await api.get('/bookings');
    return res.data.bookings || [];
  } catch (err) {
    return [
      {
        _id: 'BK-9021',
        customerName: 'Rahul Sharma',
        customerPhone: '+91 9876543210',
        serviceName: 'AC Deep Service & Jet Wash',
        date: '2026-08-15',
        timeSlot: '10:00 AM - 12:00 PM',
        address: 'Flat 402, Sunshine Heights, Mumbai',
        status: 'confirmed',
        amount: 799,
      },
      {
        _id: 'BK-9022',
        customerName: 'Priya Patel',
        customerPhone: '+91 9123456789',
        serviceName: 'Tap & Pipe Leak Repair',
        date: '2026-08-14',
        timeSlot: '02:00 PM - 04:00 PM',
        address: 'Villa 12, Green Park Avenue, Mumbai',
        status: 'pending',
        amount: 349,
      },
    ];
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const res = await api.put(`/bookings/${id}/status`, { status });
    return res.data.booking;
  } catch (err) {
    console.error('Failed to update booking status:', err);
    return null;
  }
};

export const getUsers = async () => {
  try {
    const res = await api.get('/users');
    return res.data.users || [];
  } catch (err) {
    return [
      { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9080706050', role: 'customer', status: 'Active' },
      { _id: 'u2', name: 'Priya Patel', email: 'priya@example.com', phone: '9123456789', role: 'customer', status: 'Active' },
    ];
  }
};

export const getStaff = async () => {
  try {
    const res = await api.get('/staff');
    return res.data.staff || [];
  } catch (err) {
    return [
      { _id: 's1', name: 'Suresh Kumar', email: 'suresh.tech@fixitfirst.com', phone: '9811223344', role: 'technician', specialization: 'AC & Electrical', rating: '4.9 ★', jobsCompleted: 48, status: 'Active' },
      { _id: 's2', name: 'Vikram Singh', email: 'vikram.tech@fixitfirst.com', phone: '9822334455', role: 'technician', specialization: 'Plumbing & Appliances', rating: '4.8 ★', jobsCompleted: 35, status: 'Active' },
      { _id: 's3', name: 'Anil Carpenter', email: 'anil.tech@fixitfirst.com', phone: '9833445566', role: 'technician', specialization: 'Carpentry & Furniture', rating: '4.7 ★', jobsCompleted: 29, status: 'Active' },
    ];
  }
};

export default api;
