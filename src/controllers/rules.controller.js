
const validateErrorFormatter = require("../utils/validateErrorFormatter")
const ruleService = require("../services/rule.service")
const Response = require("../utils/errorResponse")

const ruleController = {}

ruleController.getRules = async (request, response) => {
	try{
		const rule = await ruleService.getRules("Payment Scheme");
		return Response.SUCCESS({ response, data: rule})
	} catch(err){
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors })
	}
}

module.exports = ruleController