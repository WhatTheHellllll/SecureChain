import 'dotenv/config';
import connectDB from './config/database.js';
import { User } from './models/user.model.js';
import { Role } from './models/role.model.js';
import { Product } from './models/product.model.js'; // Import your Product model
import { PERMISSION_GROUPS } from './constants/permissions.js';

const seedDatabase = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('🌱 Connected to Database...');

    // 1. Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Product.deleteMany({}); // Clear products
    console.log('🧹 Cleared old Users, Roles, and Products');

    // 2. Create Roles
    const adminRole = await Role.create({
      name: 'super_admin',
      description: 'System owner with full access.',
      permissions: [PERMISSION_GROUPS.ADMIN.ALL],
    });

    const userRole = await Role.create({
      name: 'user',
      description: 'Regular customer/viewer.',
      permissions: [PERMISSION_GROUPS.PRODUCT.READ],
    });

    // 3. Create Admin User (to link to products)
    const adminUser = await User.create({
      name: 'Sokun Admin',
      email: 'admin@securechain.com',
      password: 'password123',
      role: adminRole._id,
      status: 'active',
    });

    // 4. Seed Products
    const sampleProducts = [
      {
        name: 'Industrial Ethernet Switch',
        sku: 'NET-ETH-001',
        quantity: 50,
        price: 299.99,
        category: 'Networking',
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Wireless Access Point Pro',
        sku: 'NET-WAP-002',
        quantity: 30,
        price: 150.0,
        category: 'Networking',
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'High-Speed Fiber Cable (10m)',
        sku: 'CAB-FIB-10M',
        quantity: 200,
        price: 45.5,
        category: 'Cabling',
        lastUpdatedBy: adminUser._id,
      },
      {
        name: 'Rack Mount Server Chassis',
        sku: 'SRV-CHA-4U',
        quantity: 12,
        price: 550.0,
        category: 'Hardware',
        lastUpdatedBy: adminUser._id,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(`📦 Seeded ${sampleProducts.length} Products`);

    console.log('✅ Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();
