const Joi = require("joi");

const interestValidation = {}

interestValidation.interestValidation = (data) => {
    const interestSchema = Joi.object({
        interests: Joi.array().required().messages({
            "array.base": "interest should be an array",
            "array.empty": "interest cannot be empty",
            "any.required": "interest is required"
        }),
    })

    return interestSchema.validateAsync(data, {abortEarly: false})

}

module.exports = interestValidation