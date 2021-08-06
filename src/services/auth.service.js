const  _ = require("lodash")
const bcryptUtils = require("../utils/bcryptUtils")
const helper = require("../utils/helpers")
const jwtUtils = require("../utils/token.utils")
const User = require("../data-access/user.dao")
const mail = require("./mail.service")
const token = require("./token.service")

const authService = {}

authService.register = async (data) => {
    const user = await User.findByEmail(data.email)
    if(user) throw new Error("User already exists");
    data.password = bcryptUtils.hashPassword(data.password)
    data.isVerified = false

    const newUser = await User.insert(data)
    return newUser
}
authService.login = async (data, password) => {
    const user = await User.findByEmail(data.email);
    if(!user) throw new Error("User does not exists");

    data.password = password ? password : data.password
    const validPassword = await bcryptUtils.verifyPassword(data.password, user.password)
    if(!validPassword) throw new Error("invalid email or password");

    if(!user.isVerified) {
        const verifyToken = await token.generateVerificationToken(user.email)
        await mail.sendVerificationEmail(user, verifyToken)
        return {data :_.pick(user, ['firstName', 'isVerified', 'email'])}
    }

    const authToken = jwtUtils.generateToken(user.id)
    return { authToken } 

}
 
authService.registerAndLogin = async (data) => {
    try {
        const unHashedPass = data.password  
        const newUser = await authService.register(data)
        const { authToken } = await authService.login(newUser, unHashedPass)
        return { authToken } 
    } catch(err){
        throw new Error(err)
    }
}

authService.verifyUser = async (data) => {
    try {
        const user = await User.findByEmail(data.email);
        if(!user) throw new Error("User does not exists")

        const verified = await token.verifyUserToken(data.email, data.token);
        if(!verified) throw new Error("Invalid Token");

        const updatedUser = await User.updateUserVerification(data.email)

        const authToken = jwtUtils.generateToken(user.id)
        return { authToken } 

    } catch(err){
        throw new Error(err)
    }
}

module.exports = authService