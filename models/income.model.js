import mongoose, { Schema } from "mongoose";

const incomeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  monthelyIncome: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
  },
  role: {
    type: String,
  },
});
export const Income = mongoose.model("Income", incomeSchema);
