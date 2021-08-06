const jwt = require("jsonwebtoken")

const jwtUtils = {}

jwtUtils.generateToken = (data) => {
    return jwt.sign({id: data}, process.env.SECRET ?? "")
}

module.exports = jwtUtils