import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // select excludes this option from appearing after registering into the database
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: {
      type: String,
      match: [/^\+?[\d\s-()]+$/, "Please provide a valid phone number"],
    },
    address: {
      street: { type: String, required: true },
      houseNumber: { type: Number, required: true },
      floorNumber: { type: Number },
      apartmentNumber: { type: Number },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete (ret as any).password;
        return ret;
      },
    },
  }
);

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
