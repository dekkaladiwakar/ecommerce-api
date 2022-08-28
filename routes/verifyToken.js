import jwt from "jsonwebtoken";
import { SellerModel } from "../models/Seller.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        res.status(403).json({ msg: "Token is not valid." });
      } else {
        req.user = data;
      }
      next();
    });
  } else {
    res.status(401).json({ msg: "Not authenticated." });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if ("user" in req) {
      if (req.user.id === req.params.id && req.user.isAdmin == false) {
        next();
      } else {
        res.status(403).json({
          msg: "You are not allowed to access the endpoint. Please contact your admin.",
        });
      }
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if ("user" in req) {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({
          msg: "You are not allowed to access the endpoint. Please contact your admin.",
        });
      }
    }
  });
};

const verifySellerToken = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.user);
    if ("user" in req) {
      const newSeller = SellerModel.findById(req.params.id);
      if (newSeller) {
        if (req.user.id == req.params.id) {
          next();
        } else {
          res.status(403).json({
            msg: "You are not allowed to access the endpoint.",
          });
        }
      } else {
        res.status(403).json({
          msg: "You are not allowed to access the endpoint.",
        });
      }
    }
  });
};

const verifyBuyerToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if ("user" in req) {
      if (!req.user.isSeller) {
        next();
      } else {
        res.status(403).json({
          msg: "You are not allowed to access the endpoint.",
        });
      }
    }
  });
};

export {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifySellerToken,
  verifyBuyerToken,
};
