require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit=require("express-rate-limit");
const authRoutes = require("./src/routes/authRoutes");
const quizRoutes=require("./src/routes/quizRoutes");
const codingRoutes=require("./src/routes/codingRoutes");
const mlRoutes=require("./src/routes/mlRoutes");
const leaderboardRoutes=require("./src/routes/leaderboardRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const app = express();
const limiter=rateLimit({
  windowMs:60*1000,
  max:10,
  message:{
    message:"Too many requests,please try again later."
  }
})
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/quiz",quizRoutes);
app.use("/api/coding",codingRoutes);
app.use("/api/leaderboard",leaderboardRoutes);
app.use("/api/ml",mlRoutes);
app.use("/api/admin",adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartPrep AI+ Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
