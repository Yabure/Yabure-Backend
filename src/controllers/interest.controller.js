const validateErrorFormatter = require("../utils/validateErrorFormatter")
const interestService = require("../services/interest.service")
const Response = require("../utils/errorResponse")

const interestController = {}

interestController.getAllInterest = async (request, response) => {
    try {
        const interestRes = await interestService.getAllInterest();
        return Response.SUCCESS({ response, data: interestRes})
    } catch(err) {
        const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors })
    }
}

module.exports = interestController