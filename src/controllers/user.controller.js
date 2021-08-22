const validateErrorFormatter = require("../utils/validateErrorFormatter")
// const interestService = require("../services/interest.service")
const Response = require("../utils/errorResponse")
const interestValidation = require("../validators/interest.Validation")
const userInterestService = require("../services/user.service")

const userController = {}

userController.storeInterest = async (req, res) => {
    try{
        // console.log(req.user)
        // console.log(req.body)
        const interest = await interestValidation.interestValidation(req.body)
        const saved = await userInterestService.storeInterest(interest, req.user)
        console.log(saved)
        return Response.SUCCESS({ response: res, data: "Interest added successfully"})
    } catch(err) {
        console.log(err.message)
       const errors = await validateErrorFormatter(err) 
       console.log(errors)
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

module.exports = userController