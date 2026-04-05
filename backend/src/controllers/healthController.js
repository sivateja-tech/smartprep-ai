const prisma = require("../lib/prisma");
const redis = require("../lib/redis");

exports.getHealth = async (req, res) => {
  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis
    await redis.ping();

    res.json({
      status: "OK",
      database: "connected",
      redis: "connected",
      uptime: process.uptime()
    });

  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message
    });
  }
};