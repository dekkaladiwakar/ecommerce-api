import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SellerModel = mongoose.model("Seller", SellerSchema);

export { SellerModel };
