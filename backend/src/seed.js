import 'dotenv/config';
import connectDB from './config/database.js';
import { User } from './models/user.model.js';
import { Role } from './models/role.model.js';
import { Product } from './models/product.model.js';
import { PERMISSION_GROUPS } from './constants/permissions.js';

const seedDatabase = async () => {
  try {
    // 1. Connect
    await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/securechain");
    console.log('🌱 Connected to Database...');

    // 2. Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared old Users, Roles, and Products');

    // ====================================================
    // 3. CREATE ROLES
    // ====================================================

    // Helper to get all values from a group
    const allProductPerms = Object.values(PERMISSION_GROUPS.PRODUCT);
    const allUserPerms = Object.values(PERMISSION_GROUPS.USER);
    const allRolePerms = Object.values(PERMISSION_GROUPS.ROLE);

    // Role A: Super Admin (The Owner)
    // Has Wildcard '*' access to everything
    const superAdminRole = await Role.create({
      name: 'super_admin',
      description: 'System owner with full access to everything.',
      permissions: ['*'], 
    });

    // Role B: Sub Admin (The Manager of Managers)
    // Can manage Products and Users, but cannot touch Roles or System Settings
    const subAdminRole = await Role.create({
      name: 'sub_admin',
      description: 'Can manage products and users, but not roles.',
      permissions: [
        ...allProductPerms, // Full Product Access
        ...allUserPerms,    // Full User Access
        PERMISSION_GROUPS.ROLE.READ // Can only VIEW roles, not edit them
      ],
    });

    // Role C: Inventory Manager (Focused Role)
    // Can only manage Products. Cannot see Users or Roles.
    const managerRole = await Role.create({
      name: 'inventory_manager',
      description: 'Dedicated to product stock and pricing.',
      permissions: [...allProductPerms],
    });

    // Role D: Viewer (Standard User)
    // Read-only access to products.
    const viewerRole = await Role.create({
      name: 'viewer',
      description: 'Can only view products.',
      permissions: [PERMISSION_GROUPS.PRODUCT.READ],
    });

    console.log('🛡️  Roles Created: Super Admin, Sub Admin, Manager, Viewer');

    // ====================================================
    // 4. CREATE USERS
    // ====================================================

    // 1. The Super Admin
    const adminUser = await User.create({
      name: 'Sokun Super',
      email: 'super@admin.com',
      password: 'password123',
      role: superAdminRole._id,
      status: 'active',
    });

    // 2. The Sub Admin (Test: Should NOT be able to edit Sokun Super)
    await User.create({
      name: 'Dara SubAdmin',
      email: 'sub@admin.com',
      password: 'password123',
      role: subAdminRole._id,
      status: 'active',
    });

    // 3. The Manager (Test: Should only see Product page)
    await User.create({
      name: 'Vibol Manager',
      email: 'manager@securechain.com',
      password: 'password123',
      role: managerRole._id,
      status: 'active',
    });

    // 4. The Viewer
    await User.create({
      name: 'Bopha Viewer',
      email: 'viewer@gmail.com',
      password: 'password123',
      role: viewerRole._id,
      status: 'active',
    });

    // 5. **SPECIAL TEST USER**
    // This user has the 'Viewer' role, BUT we explicitly give them 'product.create'.
    // Use this to test your User Edit Modal's "Custom Permissions" (Green Badge).
    await User.create({
      name: 'Special Intern',
      email: 'intern@securechain.com',
      password: 'password123',
      role: viewerRole._id,
      status: 'active',
      customPermissions: [PERMISSION_GROUPS.PRODUCT.CREATE], // Explicitly allowed
      deniedPermissions: []
    });

    console.log('👥 Users Created (including one with Custom Permissions)');

    // ====================================================
    // 5. SEED PRODUCTS
    // ====================================================
    // Added more products to test scrolling and searching

    const sampleProducts = [
      { name: 'Industrial Ethernet Switch', sku: 'NET-ETH-001', quantity: 50, price: 299.99, category: 'Networking' },
      { name: 'Wireless Access Point Pro', sku: 'NET-WAP-002', quantity: 30, price: 150.0, category: 'Networking' },
      { name: 'High-Speed Fiber Cable (10m)', sku: 'CAB-FIB-10M', quantity: 200, price: 45.5, category: 'Cabling' },
      { name: 'Rack Mount Server Chassis', sku: 'SRV-CHA-4U', quantity: 4, price: 550.0, category: 'Hardware' }, // Low stock!
      { name: 'Ubiquiti Dream Machine', sku: 'NET-UDM-PRO', quantity: 15, price: 379.00, category: 'Networking' },
      { name: 'Cisco Catalyst 9200', sku: 'CIS-CAT-9200', quantity: 8, price: 1250.00, category: 'Networking' },
      { name: 'Dell PowerEdge R750', sku: 'DEL-PE-R750', quantity: 2, price: 3400.00, category: 'Server' }, // Critical stock
      { name: 'Synology NAS DiskStation', sku: 'SYN-DS-923', quantity: 25, price: 599.99, category: 'Storage' },
      { name: 'APC Smart-UPS 1500VA', sku: 'PWR-UPS-1500', quantity: 12, price: 450.00, category: 'Power' },
      { name: 'Logitech MX Master 3S', sku: 'ACC-MSE-001', quantity: 150, price: 99.00, category: 'Accessories' },
      { name: 'Keychron Q1 Pro Keyboard', sku: 'ACC-KEY-002', quantity: 40, price: 199.00, category: 'Accessories' },
      { name: 'Samsung 49" Odyssey G9', sku: 'MON-SAM-G9', quantity: 5, price: 1199.00, category: 'Monitor' },
    ];

    // Add lastUpdatedBy to all products
    const productsWithUser = sampleProducts.map(p => ({
      ...p,
      lastUpdatedBy: adminUser._id
    }));

    await Product.insertMany(productsWithUser);
    console.log(`📦 Seeded ${sampleProducts.length} Products`);

    console.log('✅ Seeding Complete! Database is ready for testing.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();