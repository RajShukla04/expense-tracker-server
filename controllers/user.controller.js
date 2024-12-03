import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating token: ", error);
    throw new Error("Token generation failed");
    // return res
    //   .status(500)
    //   .json({ message: " something went wrong while generating token" });
  }
};
const signUp = async (req, res) => {
  const { fullName, email, password, userName, monthelyIncome } = req.body;
  // console.log(fullName, email, password, userName);
  // res.status(200).json({ message: "ok" });
  console.log("monthelyIncome: ", monthelyIncome);
  try {
    const userExists = await User.findOne({ $or: [{ email }, { userName }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      userName,
      fullName,
      email,
      monthelyIncome,
      password,
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        monthelyIncome: monthelyIncome,
        id: newUser._id,
      },
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({ message: "internal server error" });
  }
};
const data = async (req, res) => {
  const deta = await User.find({});
  res.status(200).json({ deta: deta });
};
const login = async (req, res) => {
  console.log("cookies: ", req.cookies);
  let accessed = false;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "all fields required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "this email isn't registered" });
  }
  const validatePassword = await user.matchPassword(password);
  if (!validatePassword) {
    return res.status(400).json({ message: "invalid password" });
  }
  const { accessToken, refreshToken } = await generateToken(user._id);
  const loggedInUser = await User.findById(user._id);
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "user logged in",
    });
};
const regenerateAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log("received refresh token: ", refreshToken);
  if (!refreshToken) {
    return res.status(400).json({ message: "no refresh token found" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("Decoded Refresh Token: ", decoded);
    const user = await User.findById(decoded._id);
    console.log("user: ", user);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(400).json({ message: "invalid reftresh token" });
    }
    // if (refreshToken !== decoded.refreshToken) {
    //   return res.status(400).json({ message: "token does not exists" });
    // }
    const { accessToken, refreshToken: newRefreshToken } = await generateToken(
      decoded._id
    );
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({ message: "token refreshed", accessToken, newRefreshToken });
  } catch (error) {
    return res.status(400).json({ message: "error whiole validating token" });
  }
};
const logOut = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json({ message: "User Logged Out" });
  } catch (error) {
    console.error("Error while Logging Out: ", error);
    res.status(500).json({ message: "something went Wrong" });
  }
};
export { signUp, login, data, regenerateAccessToken, logOut };
