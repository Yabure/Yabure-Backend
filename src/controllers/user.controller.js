const validateErrorFormatter = require("../utils/validateErrorFormatter")
const Response = require("../utils/errorResponse")
const interestValidation = require("../validators/interest.Validation")
const userService = require("../services/user.service")
const FollowersService = require("../services/follow.service")

const userController = {}

userController.storeInterest = async (req, res) => {
    try{
        const interest = await interestValidation.interestValidation(req.body)
        const saved = await userService.storeInterest(interest, req.user)
        console.log(saved)
        return Response.SUCCESS({ response: res, data: {}, message: "Interest added successfully"})
    } catch(err) {
        console.log(err.message)
       const errors = await validateErrorFormatter(err) 
       console.log(errors)
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}


userController.gtePopularUploaders = async (req, res) => {
    try{
        const result = await userService.gtePopularUploaders()
        return Response.SUCCESS({ response: res, data: result, message: "Request Successful" })
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

userController.follow = async (req, res) => {
    try{
        await FollowersService.follow(req)
        return Response.SUCCESS({ response: res, data: {}, message: "Request Successful" })
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}




module.exports = userController