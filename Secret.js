const dontenv = require("dotenv").config();

const JWTSecret = dontenv.parsed.JWT_SECRET;

module.exports = JWTSecret;
