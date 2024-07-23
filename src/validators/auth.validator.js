const Joi = require("joi");

const authValidation = {}

authValidation.registerValidation = (data) => {
    const registerSchema = Joi.object({
        firstName: Joi.string().min(3).required().messages({
            "string.base": "First name must be a string",
            "string.empty": "First name field is required",
            "any.required": "First name is required and should be greater than 3 characters"
        }),
        lastName: Joi.string().min(3).required().messages({
            "string.base": "Last name must be a string",
            "string.empty": "Last name field is required",
            "any.required": "Last name is required and should be greater than 3 characters"
        }),
        email: Joi.string().min(3).required().email().messages({
            "string.base": "Email must be a string",
            "any.required": "Email is required",
            "string.empty": "Email field is required",
            "string.email": "should be a valid email"
        }),
        phoneNumber: Joi.string().required().messages({
            "number.base": "Phone number must be a number",
            "number.empty": "Phone number field is required",
            "any.required": "Phone number is required"
        }),
        password: Joi.string().min(6).required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password field is required",
            "any.required": "Password is required and should be greater than 6 characters"
        }),
    })

    return registerSchema.validateAsync(data, {abortEarly: false})

}

authValidation.auth0Registration = (data) => {
    const auth0RegisterSchema = Joi.object({
        firstName: Joi.string().min(3).required().messages({
            "string.base": "First name must be a string",
            "string.empty": "First name field is required",
            "any.required": "First name is required and should be greater than 3 characters"
        }),
        lastName: Joi.string().min(3).required().messages({
            "string.base": "Last name must be a string",
            "string.empty": "Last name field is required",
            "any.required": "Last name is required and should be greater than 3 characters"
        }),
        email: Joi.string().min(3).required().email().messages({
            "string.base": "Email must be a string",
            "any.required": "Email is required",
            "string.empty": "Email field is required",
            "string.email": "should be a valid email"
        }),
        accessToken: Joi.string().required().messages({
            "string.base": "accessToken must be a string",
            "string.empty": "accessToken is required"
        })
    })
}

module.exports = authValidation