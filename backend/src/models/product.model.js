import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maximum: 40,
      minimum: 3,
    },
    sku: {
      // Stock Keeping Unit (Unique ID for barcode)
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    category: {
      type: String,
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // We will link this to a User later
      required: false, // Optional for now until we build Auth
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);
productSchema.pre(/^find/, function () {
  // Only show products where isActive is NOT false
  this.where({ isActive: { $ne: false } });
});
export const Product = mongoose.model("Product", productSchema);
