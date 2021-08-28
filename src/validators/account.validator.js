const Joi = require("joi");

const accountValidation = {}

accountValidation.validateAccountNumber = (data) => {
    const accountSchema = Joi.object({
        account_number: Joi.string().required().min(10).max(10).messages({
            "string.base": "Interest should be string",
            "string.min": "Account Number is Invalid",
            "string.max": "Account Number is Invalid",
            "string.empty": "Account number cannot be empty",
            "any.required": "Account number is required"
        }),
        account_bank: Joi.string().required().messages({
            "string.base": "Bank name should be a string",
            "string.empty": "Bank name cannot be empty",
            "string.required": "Bank name is required"
        }),
    })

    return accountSchema.validateAsync(data, {abortEarly: false})

}

module.exports = accountValidation