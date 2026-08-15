const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later."
  }
});

const codeSubmitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.userId) {
      return `user:${req.userId}`;
    }

    return `ip:${ipKeyGenerator(req.ip)}`;
  },

  message: {
    message: "Too many code submissions. Please try again later."
  }
});

module.exports = {
  generalLimiter,
  codeSubmitLimiter
};