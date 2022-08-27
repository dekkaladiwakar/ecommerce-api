import jwt from "jsonwebtoken";

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
      if (req.user.id === req.params.id) {
        next();
      } else {
        res
          .status(403)
          .json({ msg: "You are not allowed to access the endpoint." });
      }
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

export { verifyTokenAndAuthorization, verifyTokenAndAdmin };
