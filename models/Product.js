import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    pid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);

export { ProductModel };
