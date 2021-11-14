const authValidation = require("../validators/auth.validator")
const validateErrorFormatter = require("../utils/validateErrorFormatter")
const authService = require("../services/auth.service")
const Response = require("../utils/errorResponse")
const {FirebaseDynamicLinks} = require('firebase-dynamic-links');

const authController = {}

authController.register = async (request, response) => {
	try{
		const validatedData = await authValidation.registerValidation(request.body)
		const { authToken, data } = await authService.registerAndLogin(validatedData);
		response.setCookie(process.env.SESSION_NAME, authToken, { path: '/'})
		return Response.SUCCESS({ response, data, message: "Registered Successfully"})
	} catch(err){
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors, message: errors })
	}
}

authController.login = async (request, response) => {
	try {
		const { authToken, data } = await authService.login(request.body)
		if(Object.keys(data).length !== 0 && !data.isVerified){
			return Response.INVALID_REQUEST({ response, errors: data})
		}

		response.setCookie(process.env.SESSION_NAME, authToken, { path: '/'})
		return Response.SUCCESS({ response, data: {}, message: "Logged In Successfully"})
	} catch(err) {
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors })
	}
}

authController.verifyUser = async (request, response) => {
	try {
		const { authToken } = await authService.verifyUser(request.query);
		response.setCookie(process.env.SESSION_NAME, authToken, { path: '/'})
		return Response.SUCCESS({ response, data: {}, message: "Verified Successfully"})
	}  catch(err) {
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors })
	}
}

authController.resendVerification = async (request, response) => {
	try {
		await authService.resendVerification(request.query)

		return Response.SUCCESS({ response, data: {}, message: "Sent Successfully"})
	} catch(err) {
		const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors })
	}
}

authController.forgotPassword = async (request, response) => {
	try {
		// AIzaSyBI9aPyEA4aCUl13CAnvuLNarEA5WhU2t8
		const firebaseDynamicLinks = new FirebaseDynamicLinks("AIzaSyBI9aPyEA4aCUl13CAnvuLNarEA5WhU2t8");
		const { shortLink, previewLink } = await firebaseDynamicLinks.createLink({
			dynamicLinkInfo: {
			  domainUriPrefix: 'https://yabure.page.link',
			  link: 'https://www.yabure.page.link/',
			  androidInfo: {
				androidPackageName: 'com.example.android',
			  },
			  iosInfo: {
				iosBundleId: 'com.example.ios',
			  },
			},
		});

		return Response.SUCCESS({ response, data: {shortLink, previewLink }, message: "Sent Successfully"})
	} catch(err){
		// const errors = validateErrorFormatter(err)
		return Response.INVALID_REQUEST({ response, errors: err })
	}
	  
}

module.exports = authController