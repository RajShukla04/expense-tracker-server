import { Router } from "express";
import {
  signUp,
  login,
  data,
  regenerateAccessToken,
  logOut,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/sign-up").post(signUp);
router.route("/login").post(login);
router.route("/data").get(data);
router.route("/refresh-token").post(regenerateAccessToken);
router.route("/logout").post(verifyJWT, logOut);
export default router;
