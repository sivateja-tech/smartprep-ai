require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const quizRoutes=require("./src/routes/quizRoutes");
const codingRoutes=require("./src/routes/codingRoutes");
const mlRoutes=require("./src/routes/mlRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/quiz",quizRoutes);
app.use("/api/coding",codingRoutes);
app.use("/api/ml",mlRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartPrep AI+ Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
