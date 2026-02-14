
import dbConnect from './lib/db';
import Product from './lib/models/Product';
import User from './lib/models/User';
import mongoose from 'mongoose';

const products = [
    {
        name: 'SafeTyres Anti-Puncture Liquid (200ml)',
        description: 'Compact protection for bikes and scooters. Seals punctures instantly.',
        size: '200ml',
        price: 300,
        image: '/assets/img1.jpeg',
        stock: 150,
        popular: false,
        features: ['Ideal for two-wheelers', 'Eco-friendly formula', 'Easy application']
    },
    {
        name: 'SafeTyres Anti-Puncture Liquid (300ml)',
        description: 'Perfect for motorcycles and small cars. Reliable puncture protection.',
        size: '300ml',
        price: 450,
        image: '/assets/img1.jpeg',
        stock: 120,
        popular: true,
        features: ['Motorcycle specialized', 'Instant sealing', 'Coolant properties']
    },
    {
        name: 'SafeTyres Anti-Puncture Liquid (500ml)',
        description: 'Standard pack for cars and SUVs. Ensures a puncture-free journey.',
        size: '500ml',
        price: 750,
        image: '/assets/img2.jpeg',
        stock: 100,
        popular: true,
        features: ['Car & SUV formula', 'Prevents air loss', 'Extends tire life']
    },
    {
        name: 'SafeTyres Anti-Puncture Liquid (1L)',
        description: 'Heavy-duty protection for commercial vehicles and trucks.',
        size: '1L',
        price: 1500,
        image: '/assets/img2.jpeg',
        stock: 50,
        popular: true,
        features: ['Heavy-duty use', 'Works on large tubeless tires', 'Maximum protection']
    }
];

const adminUser = {
    name: 'Admin User',
    email: 'admin@safetyres.com',
    password: 'adminpassword123',
    role: 'admin',
    phone: '1234567890',
    address: {
        street: 'Admin St',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '00000',
        country: 'Admin Country'
    }
};

async function seedDatabase() {
    try {
        console.log('Connecting to database...');
        await dbConnect();
        console.log('Connected.');

        // --- Seed Products ---
        console.log('Seeding Products...');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('✅ Products seeded successfully.');

        // --- Seed Admin ---
        console.log('Seeding Admin User...');
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists. Updating password...');
            existingAdmin.password = adminUser.password;
            await existingAdmin.save();
            console.log('✅ Admin password updated.');
        } else {
            await User.create(adminUser);
            console.log('✅ Admin user created.');
        }

        console.log('\n--- Seeding Complete ---');
        console.log('Admin Credentials:');
        console.log(`Email: ${adminUser.email}`);
        console.log(`Password: ${adminUser.password}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    }
}

seedDatabase();
