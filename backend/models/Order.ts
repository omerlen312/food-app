import mongoose, { Document, Schema } from "mongoose";

const orderSchema = new Schema({
  userid: { type: String, required: true },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
});

export interface IOrder extends Document {
  userid: string;
  items: mongoose.Types.ObjectId[];
  total: number;
  createdAt: Date;
  status: "pending" | "completed" | "cancelled";
}

export const Order = mongoose.model<IOrder>("Order", orderSchema);
