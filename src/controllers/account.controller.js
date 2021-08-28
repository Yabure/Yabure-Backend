const authValidation = require("../validators/auth.validator")
const validateErrorFormatter = require("../utils/validateErrorFormatter")
const authService = require("../services/auth.service")
const Response = require("../utils/errorResponse")
const accountValidation = require("../validators/account.validator")
const accountService = require("../services/account.service")

const accountController = {}

accountController.verify = async (req, res) => {
	try{
        const validatedData = await accountValidation.validateAccountNumber(req.query)
        const account = await accountService.verify(validatedData);
		return Response.SUCCESS({ response: res, data: account, message: "Verified Successfully"})
	} catch(err){
		console.log(err)
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response: res, errors     })
	}
}

accountController.getBanks = async (req, res) => {
	try{
        const banks = await accountService.getBanks()
		return Response.SUCCESS({ response: res, data: banks, message: "Fetched Successfully"})
	} catch(err){
		console.log(err)
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response: res, errors     })
	}
}

// authController.login = async (request, response) => {
// 	try {
// 		const { authToken, data } = await authService.login(request.body)
// 		if(Object.keys(data).length !== 0 && !data.isVerified){
// 			return Response.INVALID_REQUEST({ response, errors: data})
// 		}

// 		response.setCookie(process.env.SESSION_NAME, authToken, { path: '/'})
// 		return Response.SUCCESS({ response, data: {}, message: "Logged In Successfully"})
// 	} catch(err) {
// 		const errors = validateErrorFormatter(err)
// 		return Response.INVALID_REQUEST({ response, errors })
// 	}
// }

// authController.verifyUser = async (request, response) => {
// 	try {
// 		const { authToken } = await authService.verifyUser(request.query);
// 		response.setCookie(process.env.SESSION_NAME, authToken, { path: '/'})
// 		return Response.SUCCESS({ response, data: {}, message: "Verified Successfully"})
// 	}  catch(err) {
// 		const errors = validateErrorFormatter(err)
// 		return Response.INVALID_REQUEST({ response, errors })
// 	}

module.exports = accountController