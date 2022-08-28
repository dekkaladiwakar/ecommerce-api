import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  status: {
    type: String,
    enum: [
      "Placed",
      "Confirmed",
      "Dispatched",
      "Out for Delivery",
      "Delivered",
    ],
    required: true,
    default: "Placed",
  },
});

var OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };
