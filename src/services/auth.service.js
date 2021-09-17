const  _ = require("lodash")
const bcryptUtils = require("../utils/bcryptUtils")
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
        return { authToken, data: {} } 


    

} 
 
authService.registerAndLogin = async (user) => {
    try {
        const unHashedPass = user.password  
        const newUser = await authService.register(user)    
        const { authToken, data } = await authService.login(newUser, unHashedPass)
        return { authToken, data } 
    } catch(err){
        console.log("error happend", err)
        throw new Error(err)
    }
}

authService.verifyUser = async (data) => {
  
        if(!data.email || !data.token) throw new Error("Token or Email is empty")
        const user = await User.findByEmail(data.email);
        if(!user) throw new Error("User does not exists")

        const verified = await token.verifyUserToken(data.email, data.token);
        if(!verified) throw new Error("Invalid Token");

        await User.updateUserVerification(data.email)

        const authToken = jwtUtils.generateToken(user.id)
        return { authToken } 

  
}

module.exports = authService