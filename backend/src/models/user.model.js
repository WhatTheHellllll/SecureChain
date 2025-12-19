import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true, 
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false, 
    },
    
    // store the Role's ID, not just a string. 
    // This lets us look up the role's permissions later.
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role", 
      required: true,
    },

    // Things this user CAN do, even if their Role cannot
   customPermissions: {
      type: [String], 
      default: []
    },

    // Permissions strictly TAKEN AWAY from them
    deniedPermissions: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

// SECURITY: Hash the password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper to check password match
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


export const User = mongoose.model("User", userSchema);