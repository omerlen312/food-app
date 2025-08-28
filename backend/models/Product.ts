import mongoose, { Document, Schema } from "mongoose";

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

export interface IProduct extends Document {
  title: string;
  price: number;
  image: string;
  description: string;
}
export const Product = mongoose.model<IProduct>("Product", productSchema);
