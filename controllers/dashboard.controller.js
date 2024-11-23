const dashboard = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    res.status(200).json(user);
  } catch (error) {
    // console.error("Error fetching dashboard data:", error);
    console.error("Error fetching dashboard data:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

export { dashboard };

/*
app.get("dashboard", verifyJWT, async(req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: `welsome ${user.fullName}` });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
  }) */
