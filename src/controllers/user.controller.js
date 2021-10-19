const validateErrorFormatter = require("../utils/validateErrorFormatter")
const Response = require("../utils/errorResponse")
const interestValidation = require("../validators/interest.Validation")
const userService = require("../services/user.service")
const ratingService = require("../services/rating.service")

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

userController.getUserRating = async (req, res) => {
    try{
        const rating = await ratingService.getUserRating(req.query)
        return Response.SUCCESS({ response: res, data: rating, message: "Request Successful" })
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

userController.rateUser = async (req, res) => {
    try {
        await userService.addRatings(req.body)
        Response.SUCCESS({response: res, data: {}, message: "Rated User Successfully" })
    } catch(error){
        const errors = validateErrorFormatter(error)
		return Response.INVALID_REQUEST({ response: res, errors })
    }
}

module.exports = userController