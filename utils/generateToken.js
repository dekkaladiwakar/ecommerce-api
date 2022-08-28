import jwt from "jsonwebtoken";

const generateAccessToken = (userId, { isAdmin = false, isSeller = false }) => {
  const accessToken = jwt.sign(
    {
      id: userId,
      isAdmin: isAdmin,
      isSeller: isSeller,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return accessToken;
};

export { generateAccessToken };
