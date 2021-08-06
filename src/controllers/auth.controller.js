const authValidation = require("../validators/auth.validator")
const validateErrorFormatter = require("../utils/validateErrorFormatter")
const authService = require("../services/auth.service")
const Response = require("../utils/errorResponse")

const authController = {}

authController.register = async (request, response) => {
	try{
		const validatedData = await authValidation.registerValidation(request.body)
		const { authToken } = await authService.registerAndLogin(validatedData);
		response.setCookie(process.env.SESSION_NAME, JSON.stringify({authToken}), { path: '/', signed: true })
		return Response.SUCCESS({ response, data: {}})
	} catch(err){
		const errors = validateErrorFormatter(err)
		//@ts-ignore
		return Response.INVALID_REQUEST({ response, errors })
	}
}

authController.login = async (request, response) => {
	try {
		const { authToken, data } = await authService.login(request.body)
		if(data && !data.isVerified){
			return Response.INVALID_REQUEST({ response, errors: data})
		}

		response.setCookie(process.env.SESSION_NAME, JSON.stringify({authToken}), { path: '/', signed: true })
		return Response.SUCCESS({ response, data: {}})
	} catch(err) {
		const errors = validateErrorFormatter(err)
		console.log(err)
		return Response.INVALID_REQUEST({ response, errors })
	}
}

authController.verifyUser = async (request, response) => {
	try {
		const { authToken } = await authService.verifyUser(request.query);
		response.setCookie(process.env.SESSION_NAME, JSON.stringify({authToken}), { path: '/', signed: true })
		return Response.SUCCESS({ response, data: {}})
	}  catch(err) {
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors })
	}
}

module.exports = authController