import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: int, required: true },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);

export { ProductModel };
