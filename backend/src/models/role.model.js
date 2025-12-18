import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // e.g., "manager", "support_staff"
      trim: true,
      lowercase: true,
    },
    description: { type: String },
    // The master list of what this role allows
    permissions: [{
        type: String, // e.g., "product.create", "user.read", "report.view"
    }]
  },
  { timestamps: true }
);


export const Role = mongoose.model('Role', roleSchema);