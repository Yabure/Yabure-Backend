const jwt = require("jsonwebtoken");

const jwtUtils = {};

jwtUtils.generateToken = (data) => {
  return jwt.sign(data, process.env.SECRET ?? "");
};

jwtUtils.decrypt = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

module.exports = jwtUtils;
