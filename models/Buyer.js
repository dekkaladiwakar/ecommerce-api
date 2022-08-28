import mongoose from "mongoose";

const BuyerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BuyerModel = mongoose.model("Buyer", BuyerSchema);

export { BuyerModel };
