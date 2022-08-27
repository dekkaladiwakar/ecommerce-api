import jwt from "jsonwebtoken";

const generateAccessToken = (userId, isAdmin = false, isInternal = false) => {
  const accessToken = jwt.sign(
    {
      id: userId,
      isAdmin: isAdmin,
      isInternal: isInternal,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return accessToken;
};

export { generateAccessToken };
