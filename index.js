import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRoute } from "./routes/auth.js";
import { userRoute } from "./routes/user.js";
import { internalRoute } from "./routes/internalAuth.js";
import { productRoute } from "./routes/product.js";
import { catalogRoute } from "./routes/catalog.js";
import { orderRoute } from "./routes/order.js";

// Loading .env
dotenv.config();

const app = express();

app.use(express.json());

// Routes
// app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/internal", internalRoute);
app.use("/api/products", productRoute);
app.use("/api/catalog", catalogRoute);
app.use("/api/orders", orderRoute);

// DB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB....");
  })
  .catch((err) => console.log(err));

// @desc: Check API Working status
// @route: GET localhost:5000/health-check
// @access: public
app.get("/health-check", (req, res) => {
  res.send("APIs are working!");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running....");
});
