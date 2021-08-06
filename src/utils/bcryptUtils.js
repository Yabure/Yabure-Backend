const bcrypt = require("bcrypt")

const bcryptUtils = {}

bcryptUtils.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}
bcryptUtils.verifyPassword = (incomingPassword, userPassword) => {
    return bcrypt.compare(incomingPassword, userPassword)
}

module.exports = bcryptUtils