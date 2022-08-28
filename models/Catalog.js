import mongoose from "mongoose";

const catalogSchema = mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

var CatalogModel = mongoose.model("Catalog", catalogSchema);

export { CatalogModel };
