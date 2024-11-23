import { Expense } from "../models/expense.model.js";

const addExpense = async (req, res) => {
  const { category, amount, description } = req.body;
  if (!category || !amount || !description) {
    return res.status(401).json({ message: "please enter all fields" });
  }
  const expense = new Expense({
    userId: req.user._id,
    category,
    amount,
    description,
  });
  await expense.save();
  return res.status(201).json({
    message: "successfully inserted",
    expense: {
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      userId: expense.userId,
    },
  });
};

const getExpense = async (req, res) => {
  try {
    const expense = await Expense.find({ userId: req.user._id });
    return res.status(200).json({ expense: expense });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addExpense, getExpense };
