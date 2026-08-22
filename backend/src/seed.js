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

    // 1. Customers
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

    // 2. Staff / Technicians
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

    // 3. MAIN CATEGORIES (Store main category, bookingCount, website image link, mobile icon)
    const mainCategories = [
      {
        name: 'Air Conditioner Service',
        description: 'AC installation, gas refilling, jet wash cleaning & complete repair.',
        icon: 'ac_unit_rounded',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
        bookingCount: 142,
      },
      {
        name: 'Home Electrical',
        description: 'Switchboard repair, ceiling fan installation, house wiring & inverter setup.',
        icon: 'electrical_services_rounded',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
        bookingCount: 98,
      },
      {
        name: 'Chimney Service',
        description: 'Kitchen chimney deep cleaning, ducting installation & motor repair.',
        icon: 'soup_kitchen_rounded',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
        bookingCount: 65,
      },
      {
        name: 'Washing Machine Service',
        description: 'Automatic washing machine installation, drum check & motor fix.',
        icon: 'local_laundry_service_rounded',
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800',
        bookingCount: 84,
      },
      {
        name: 'Refrigerator Service',
        description: 'Fridge gas refilling, thermostat repair, compressor fix & gasket replace.',
        icon: 'kitchen_rounded',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
        bookingCount: 77,
      },
      {
        name: 'CCTV Service',
        description: 'HD CCTV camera setup, DVR hard disk config & mobile view setup.',
        icon: 'videocam_rounded',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
        bookingCount: 53,
      },
      {
        name: 'Other Services',
        description: 'Plumbing leak repair, tap fitting, carpentry woodwork & painting.',
        icon: 'home_repair_service_rounded',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
        bookingCount: 41,
      },
    ];

    const catDocs = {};
    for (const c of mainCategories) {
      const doc = await Category.findOneAndUpdate(
        { name: c.name },
        {
          name: c.name,
          description: c.description,
          icon: c.icon,
          image: c.image,
          bookingCount: c.bookingCount,
          isActive: true,
        },
        { upsert: true, returnDocument: 'after' }
      );
      catDocs[c.name] = doc._id;
    }

    // 4. CHILD SERVICES UNDER MAIN CATEGORIES (Price starting from, duration, description, picture)
    const childServices = [
      // Under Air Conditioner Service
      {
        name: 'AC Installation',
        categoryName: 'Air Conditioner Service',
        price: 1199,
        discountPrice: 999,
        duration: 90,
        description: 'Expert mounting, copper piping and testing for split & window AC.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
      },
      {
        name: 'AC Gas Refilling',
        categoryName: 'Air Conditioner Service',
        price: 1999,
        discountPrice: 1799,
        duration: 90,
        description: 'Complete Freon R32/R410 gas refill with leak soldering test.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
      },
      {
        name: 'AC Deep Cleaning & Jet Wash',
        categoryName: 'Air Conditioner Service',
        price: 699,
        discountPrice: 499,
        duration: 60,
        description: 'High pressure water jet wash of indoor and outdoor AC coils.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
      },
      {
        name: 'AC Repair & Troubleshooting',
        categoryName: 'Air Conditioner Service',
        price: 499,
        discountPrice: 349,
        duration: 45,
        description: 'Diagnostic check, PCB repair, capacitor replacement & wiring fix.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
      },

      // Under Home Electrical
      {
        name: 'Switchboard Repair & Fitting',
        categoryName: 'Home Electrical',
        price: 199,
        discountPrice: 149,
        duration: 30,
        description: 'Modular switch replacement, socket fitting & MCB fuse repair.',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
      },
      {
        name: 'Ceiling Fan Installation & Repair',
        categoryName: 'Home Electrical',
        price: 249,
        discountPrice: 199,
        duration: 30,
        description: 'Ceiling fan hanging, regulator & capacitor replacement.',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
      },
      {
        name: 'House Wiring Check & Fix',
        categoryName: 'Home Electrical',
        price: 499,
        discountPrice: 399,
        duration: 90,
        description: 'Short circuit fault finding, conduit wire pull & DB box setup.',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
      },
      {
        name: 'Inverter & Battery Setup',
        categoryName: 'Home Electrical',
        price: 749,
        discountPrice: 599,
        duration: 60,
        description: 'Inverter wiring connection, battery terminal setup & testing.',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
      },

      // Under Chimney Service
      {
        name: 'Kitchen Chimney Deep Cleaning',
        categoryName: 'Chimney Service',
        price: 699,
        discountPrice: 549,
        duration: 60,
        description: 'Degreasing baffle filters, motor oil collector and blowers.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
      },
      {
        name: 'Chimney Installation & Ducting',
        categoryName: 'Chimney Service',
        price: 999,
        discountPrice: 799,
        duration: 90,
        description: 'Wall mounting chimney, duct pipe fitting and hole cutting.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
      },
      {
        name: 'Chimney Motor & Filter Repair',
        categoryName: 'Chimney Service',
        price: 499,
        discountPrice: 399,
        duration: 45,
        description: 'Touch panel fix, motor capacitor & switch replacement.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
      },

      // Under Washing Machine Service
      {
        name: 'Washing Machine Installation',
        categoryName: 'Washing Machine Service',
        price: 349,
        discountPrice: 249,
        duration: 30,
        description: 'Inlet hose tap connection and drain pipe placement.',
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800',
      },
      {
        name: 'Drum & Motor Repair',
        categoryName: 'Washing Machine Service',
        price: 599,
        discountPrice: 449,
        duration: 60,
        description: 'Drum vibration fix, belt replacement & motor servicing.',
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800',
      },
      {
        name: 'Water Drain & Valve Fix',
        categoryName: 'Washing Machine Service',
        price: 399,
        discountPrice: 299,
        duration: 45,
        description: 'Drain pump error fix, inlet water valve replacement.',
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800',
      },

      // Under Refrigerator Service
      {
        name: 'Fridge Gas Refilling',
        categoryName: 'Refrigerator Service',
        price: 1499,
        discountPrice: 1299,
        duration: 90,
        description: 'Refrigerant gas vacuuming & refill with cooling coil leak test.',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
      },
      {
        name: 'Thermostat & Cooling Repair',
        categoryName: 'Refrigerator Service',
        price: 699,
        discountPrice: 499,
        duration: 45,
        description: 'Thermostat replacement, defrost timer & sensor fix.',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
      },
      {
        name: 'Compressor Repair & Replacement',
        categoryName: 'Refrigerator Service',
        price: 2199,
        discountPrice: 1899,
        duration: 120,
        description: 'Compressor replacement, relay switch fix & gas charging.',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
      },
      {
        name: 'Door Gasket Replacement',
        categoryName: 'Refrigerator Service',
        price: 399,
        discountPrice: 299,
        duration: 30,
        description: 'Magnetic rubber seal replacement for air-tight door closure.',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
      },

      // Under CCTV Service
      {
        name: 'CCTV Camera Setup & Installation',
        categoryName: 'CCTV Service',
        price: 1199,
        discountPrice: 999,
        duration: 90,
        description: 'Indoor & outdoor IP/HD camera mounting with power adapter.',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
      },
      {
        name: 'DVR & Hard Disk Configuration',
        categoryName: 'CCTV Service',
        price: 1499,
        discountPrice: 1199,
        duration: 90,
        description: 'Coaxial cabling, DVR hard disk config & mobile live view setup.',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
      },
      {
        name: 'Night Vision Camera Repair',
        categoryName: 'CCTV Service',
        price: 599,
        discountPrice: 449,
        duration: 45,
        description: 'IR LED sensor fix, BNC connector fix & lens adjustment.',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
      },
      {
        name: 'CCTV Cabling & Maintenance',
        categoryName: 'CCTV Service',
        price: 449,
        discountPrice: 349,
        duration: 45,
        description: 'Wire conduit repair, channel power supply check & maintenance.',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
      },

      // Under Other Services
      {
        name: 'Tap & Pipe Leak Repair',
        categoryName: 'Other Services',
        price: 299,
        discountPrice: 199,
        duration: 30,
        description: 'Sink tap washer replacement, pipe joint leak soldering & fitting.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
      },
      {
        name: 'Water Tank Cleaning',
        categoryName: 'Other Services',
        price: 799,
        discountPrice: 599,
        duration: 60,
        description: 'Overhead PVC water tank deep scrub, sludge removal & antibacterial rinse.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
      },
      {
        name: 'Furniture & Woodwork Repair',
        categoryName: 'Other Services',
        price: 399,
        discountPrice: 299,
        duration: 45,
        description: 'Door hinge alignment, drawer lock replacement & table fix.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
      },
      {
        name: 'Wall Painting Touchup',
        categoryName: 'Other Services',
        price: 999,
        discountPrice: 799,
        duration: 90,
        description: 'Waterproof putty application, sanding & matching wall paint touchup.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
      },
    ];

    for (const s of childServices) {
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
            image: s.image,
            isActive: true,
          },
          { upsert: true, returnDocument: 'after' }
        );
      }
    }

    // 5. Sample Bookings
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      await Booking.create({
        customerName: 'Rahul Sharma',
        customerPhone: '9080706050',
        serviceName: 'AC Deep Cleaning & Jet Wash',
        date: '2026-08-16',
        timeSlot: '10:00 AM - 12:00 PM',
        address: 'Flat 402, Sunshine Heights',
        amount: 499,
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
