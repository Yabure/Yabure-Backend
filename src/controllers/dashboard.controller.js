// const validateErrorFormatter = require("../utils/validateErrorFormatter")
const Response = require("../utils/errorResponse")
// const interestValidation = require("../validators/interest.Validation")
const userInterestService = require("../services/user.service")

const dashboardController = {}

dashboardController.storeInterest = async (req, res) => {
    try{
        const interest = await interestValidation.interestValidation(req.body)
        const saved = await userInterestService.storeInterest(interest, req.user)
        return Response.SUCCESS({ response: res, data: "Interest added successfully"})
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

module.exports = dashboardController