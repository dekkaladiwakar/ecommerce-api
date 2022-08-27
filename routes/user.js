import { Router } from "express";
import { BuyerModel } from "../models/Buyer.js";
import { verifyTokenAndAuthorization } from "./verifyToken.js";
import CryptoJS from "crypto-js";

const router = Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSPHRASE
    ).toString();
  }

  try {
    const updatedBuyer = await BuyerModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBuyer);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as userRoute };
