import 'dotenv/config';
import connectDB from './config/database.js';
import {User} from "./models/user.model.js";
import {Role} from "./models/role.model.js";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    console.log("🌱 Connected to Database...");

    // Clear old data (Optional - BE CAREFUL with this in production!)
    // await User.deleteMany({});
    // await Role.deleteMany({});

    // Create the "Super Admin" Role
    let adminRole = await Role.findOne({ name: "super_admin" });

    if (!adminRole) {
      adminRole = await Role.create({
        name: "super_admin",
        description: "The Boss. Can do everything.",
        permissions: ["*"] // Wildcard permission (we'll handle logic for this later)
      });
      console.log("👑 Super Admin Role Created");
    } else {
      console.log("ℹ️ Admin Role already exists");
    }

    // Create the "Super Admin" User
    const adminEmail = "admin@securechain.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      // Hash password manually since we are bypassing the model .save() hook logic sometimes, 
      // but sticking to standard create() is safer.
      // However, since we defined the pre-save hook in user.model.js, 
      // passing the plain text password here is actually correct! 
      // The model will hash it for us.
      
      await User.create({
        name: "Sokun Admin",
        email: adminEmail,
        password: "password123", // The hook in your model will hash this!
        role: adminRole._id,     // Link to the Role ID we just found/created
        status: "active",
        customPermissions: [],
        deniedPermissions: []
      });
      
      console.log(`👤 Admin User Created: ${adminEmail} / password123`);
    } else {
      console.log("ℹ️ Admin User already exists");
    }

    console.log("✅ Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedDatabase();