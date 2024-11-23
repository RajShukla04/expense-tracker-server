import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addExpense, getExpense } from "../controllers/expense.controller.js";

const router = Router();
router.route("/get-expense").get(verifyJWT, getExpense);
router.route("/add-expense").post(verifyJWT, addExpense);
export default router;
