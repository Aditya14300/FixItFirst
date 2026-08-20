const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Staff = require('./models/Staff');
const Category = require('./models/Category');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/FixItFirst';
    console.log('Connecting to MongoDB Atlas database FixItFirst...');
    await mongoose.connect(mongoUri, { dbName: 'FixItFirst' });
    console.log('Connected successfully!');

    const hashedPass = await bcrypt.hash('123456', 10);

    // 1. Ensure 'users' collection has customer data ONLY
    await User.deleteMany({ role: 'technician' });
    await User.deleteMany({ role: 'admin' });
    await User.deleteMany({ role: 'staff' });

    const customers = [
      { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9080706050', password: hashedPass, role: 'customer' },
      { name: 'Priya Patel', email: 'priya@example.com', phone: '9123456789', password: hashedPass, role: 'customer' },
      { name: 'Amit Verma', email: 'amit@example.com', phone: '9876543210', password: hashedPass, role: 'customer' },
      { name: 'Anjali Roy', email: 'anjali@example.com', phone: '9988776655', password: hashedPass, role: 'customer' },
    ];
    for (const c of customers) {
      const existing = await User.findOne({ phone: c.phone });
      if (!existing) await User.create(c);
    }

    // 2. Ensure 'staff' collection has technician & admin data
    const staffMembers = [
      { name: 'Suresh Kumar', email: 'suresh.tech@fixitfirst.com', phone: '9811223344', password: hashedPass, role: 'technician', specialization: 'AC & Electrical', rating: '4.9 ★', jobsCompleted: 48 },
      { name: 'Vikram Singh', email: 'vikram.tech@fixitfirst.com', phone: '9822334455', password: hashedPass, role: 'technician', specialization: 'Plumbing & Appliances', rating: '4.8 ★', jobsCompleted: 35 },
      { name: 'Anil Carpenter', email: 'anil.tech@fixitfirst.com', phone: '9833445566', password: hashedPass, role: 'technician', specialization: 'Carpentry & Furniture', rating: '4.7 ★', jobsCompleted: 29 },
      { name: 'Master Admin', email: 'admin@fixitfirst.com', phone: '7735552029', password: hashedPass, role: 'admin', specialization: 'System Admin', rating: '5.0 ★', jobsCompleted: 100 },
    ];
    for (const s of staffMembers) {
      const existing = await Staff.findOne({ phone: s.phone });
      if (!existing) await Staff.create(s);
    }

    // 3. Ensure 'categories' collection
    const categoriesData = [
      { name: 'AC Service', description: 'AC installation, jet wash cleaning & gas refilling', icon: 'Wind', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800' },
      { name: 'Electrical', description: 'Fan installation, house wiring & inverter setup', icon: 'Zap', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800' },
      { name: 'Chimney Service', description: 'Chimney installation, deep cleaning & repair', icon: 'Flame', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800' },
      { name: 'Washing Machine Service', description: 'Washing machine installation & motor fix', icon: 'Tv', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800' },
      { name: 'Geyser Service', description: 'Geyser fitting, thermostat & element repair', icon: 'Droplets', img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800' },
      { name: 'CCTV Service', description: 'CCTV camera setup, DVR config & wiring', icon: 'Shield', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800' },
      { name: 'Router / Internet Service', description: 'Wi-Fi router setup, LAN cabling & internet fix', icon: 'Wifi', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800' },
      { name: 'TV Service', description: 'TV wall mount fitting, display & sound repair', icon: 'Tv', img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800' },
      { name: 'Plumbing', description: 'Tap repair, leak fix & water pipe fitting', icon: 'Wrench', img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800' },
    ];
    const catDocs = {};
    for (const c of categoriesData) {
      const doc = await Category.findOneAndUpdate(
        { name: c.name },
        { name: c.name, description: c.description, icon: c.icon, img: c.img, isActive: true },
        { upsert: true, returnDocument: 'after' }
      );
      catDocs[c.name] = doc._id;
    }

    // 4. Ensure 'services' collection
    const servicesData = [
      { name: 'AC Installation', categoryName: 'AC Service', price: 1499, discountPrice: 1199, duration: 90, description: 'Expert mounting, copper piping and testing for split & window AC.' },
      { name: 'AC Deep Cleaning & Jet Wash', categoryName: 'AC Service', price: 899, discountPrice: 699, duration: 60, description: 'High pressure water jet wash of indoor and outdoor AC coils.' },
      { name: 'AC Gas Filling & Leak Fix', categoryName: 'AC Service', price: 2499, discountPrice: 1999, duration: 90, description: 'Complete Freon R32/R410 gas refill with leak soldering test.' },
      { name: 'Fan Installation & Fix', categoryName: 'Electrical', price: 349, discountPrice: 249, duration: 30, description: 'Ceiling fan hanging, regulator & capacitor replacement.' },
      { name: 'Full House Wiring & Fitting', categoryName: 'Electrical', price: 4999, discountPrice: 3999, duration: 240, description: 'Complete electrical conduit wiring and DB box installation.' },
      { name: 'Inverter & Battery Installation', categoryName: 'Electrical', price: 999, discountPrice: 749, duration: 60, description: 'Inverter wiring connection and battery terminal setup.' },
      { name: 'Chimney Installation', categoryName: 'Chimney Service', price: 1299, discountPrice: 999, duration: 90, description: 'Wall mounting chimney, duct pipe fitting and hole cutting.' },
      { name: 'Chimney Deep Cleaning', categoryName: 'Chimney Service', price: 899, discountPrice: 699, duration: 60, description: 'Degreasing baffle filters, motor oil collector and blowers.' },
      { name: 'Chimney Repair', categoryName: 'Chimney Service', price: 699, discountPrice: 499, duration: 45, description: 'Touch panel fix, motor capacitor & switch replacement.' },
      { name: 'Washing Machine Installation', categoryName: 'Washing Machine Service', price: 499, discountPrice: 349, duration: 30, description: 'Inlet hose tap connection and drain pipe placement.' },
      { name: 'Washing Machine Repair & Checkup', categoryName: 'Washing Machine Service', price: 699, discountPrice: 499, duration: 45, description: 'Drum vibration, drain pump error and PCB repair.' },
      { name: 'Geyser Installation', categoryName: 'Geyser Service', price: 599, discountPrice: 449, duration: 45, description: 'Wall mounting water heater with inlet-outlet hose connection.' },
      { name: 'Geyser Repair & Element Fix', categoryName: 'Geyser Service', price: 699, discountPrice: 499, duration: 45, description: 'Heating coil replacement, thermostat & safety valve fix.' },
      { name: 'CCTV Camera Installation', categoryName: 'CCTV Service', price: 1499, discountPrice: 1199, duration: 120, description: 'Indoor & outdoor IP/HD camera mounting with power supply.' },
      { name: 'CCTV Wiring & DVR Setup', categoryName: 'CCTV Service', price: 1999, discountPrice: 1499, duration: 150, description: 'Coaxial cabling, DVR hard disk config & mobile live view setup.' },
      { name: 'Wi-Fi Router Setup & Config', categoryName: 'Router / Internet Service', price: 399, discountPrice: 299, duration: 30, description: 'PPPoE/Static IP router setup, SSID & password configuration.' },
      { name: 'LAN / Ethernet Cable Wiring', categoryName: 'Router / Internet Service', price: 599, discountPrice: 449, duration: 45, description: 'CAT6 RJ45 crimping, faceplate fitting and speed test.' },
      { name: 'TV Wall Mount Installation', categoryName: 'TV Service', price: 499, discountPrice: 349, duration: 30, description: 'Precision wall bracket drilling and LED/OLED TV mounting.' },
      { name: 'TV Display & Sound Repair', categoryName: 'TV Service', price: 999, discountPrice: 799, duration: 60, description: 'Backlight LED strip fix, motherboard & speaker repair.' },
    ];

    for (const s of servicesData) {
      const catId = catDocs[s.categoryName];
      if (catId) {
        await Service.findOneAndUpdate(
          { name: s.name },
          {
            name: s.name,
            category: catId,
            price: s.price,
            discountPrice: s.discountPrice,
            duration: s.duration,
            description: s.description,
            image: categoriesData.find(c => c.name === s.categoryName)?.img || '',
            isActive: true,
          },
          { upsert: true, returnDocument: 'after' }
        );
      }
    }

    // 5. Ensure 'bookings' collection
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      await Booking.create({
        customerName: 'Rahul Sharma',
        customerPhone: '9080706050',
        serviceName: 'AC Deep Cleaning & Jet Wash',
        date: '2026-08-16',
        timeSlot: '10:00 AM - 12:00 PM',
        address: 'Flat 402, Sunshine Heights',
        amount: 699,
        status: 'confirmed',
      });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('==============================================');
    console.log('✅ ALL COLLECTIONS IN FixItFirst DATABASE:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(` -> Collection '${col.name}': ${count} documents`);
    }
    console.log('==============================================');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seedDatabase();
