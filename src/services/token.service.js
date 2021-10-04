const Token = require("../data-access/token.dao");
const helper = require("../utils/helpers")

token = {}

token.generateVerificationToken = async (email) => {
    const userToken = await Token.findByEmail(email)
    if(userToken) await Token.remove(userToken.email)
    const tokenDigits = helper.randomSixDigits();
    const data = {
        email, 
        token: tokenDigits
    }
    await Token.insert(data)
    return tokenDigits
}

token.verifyUserToken = async (email, token) => {
    const userToken = await Token.findByEmail(email)
    if(userToken && userToken.token === token) {
        await Token.remove(email)
        return true
    }
    return false
}

module.exports = token