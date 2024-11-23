import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  console.log("access token received: ", token);

  if (!token) {
    console.log("no token found");
    return res.status(400).json({
      message: "please request to /refresh-token to generate new access token",
    });
  }
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ message: "Invalid or expired token." });
  //   }
  //   req.user = user;
  //   next();
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded token: ", decodedToken);
    // const user = await User.findById(decodedToken._id).select("password");
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({ message: "invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("JWT Verification Error: ", error);
    if (error.name === "TokenExpiredError") {
      console.log("TOken Expired At: ", error.expiredAt);
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    console.log("error: ", error);
    return res.status(401).json({ message: "Internal server error." });
  }
};

export { verifyJWT };
