const Joi = require("joi");

const profileValidation = {}

profileValidation.validateProfile= (data) => {
    const profileSchema = Joi.object({
        full_name: Joi.string().required().min(5).messages({
            "string.base": "fullName should be string",
            "string.empty": "fullName cannot be empty",
            "any.required": "fullName is required"
        }),
        user_name: Joi.string().required().min(5).messages({
            "string.base": "Username should be string",
            "string.empty": "Username cannot be empty",
            "any.required": "Username is required"
        }),
        phone: Joi.string().required().min(11).max(11).messages({
            "string.base": "Phone Number should be string",
            "string.empty": "Phone Number cannot be empty",
            "string.min": "Phone Number is Invalid",
            "string.max": "Phone Number is Invalid",
            "any.required": "Phone Number is required"
        }),
        account_name: Joi.string().required().messages({
            "string.base": "Account name should be string",
            "string.empty": "Account name cannot be empty",
            "any.required": "Account name is required"
        }),
        account_number: Joi.string().required().min(10).max(10).messages({
            "string.base": "Account should be string",
            "string.min": "Account number is Invalid",
            "string.max": "Account number is Invalid",
            "string.empty": "Account number cannot be empty",
            "any.required": "Account number is required"
        }),
        account_bank: Joi.string().required().messages({
            "string.base": "Bank name should be a string",
            "string.empty": "Bank name cannot be empty",
            "any.required": "Bank name is required",
        }),
    })

    return profileSchema.validateAsync(data, {abortEarly: false})

}

module.exports = profileValidation