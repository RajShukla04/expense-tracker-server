import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { dashboard } from "../controllers/dashboard.controller.js";
import { addExpense, getExpense } from "../controllers/expense.controller.js";

const router = Router();

router.route("/dashboard").post(verifyJWT, dashboard);
export default router;
