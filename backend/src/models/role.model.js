import mongoose from "mongoose";
import { VALID_PERMISSIONS } from "../constants/permissions.js";

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
    permissions: [
      {
        type: [String],
        enum: VALID_PERMISSIONS, // Only allow valid strings from our dictionary
        default: [],
        trim: true,
      },
    ],
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
