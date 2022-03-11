const Joi = require("joi");

const profileValidation = {};

profileValidation.validateProfile = (data) => {
  const profileSchema = Joi.object({
    full_name: Joi.string().min(5).messages({
      "string.base": "fullName should be string",
      "string.empty": "fullName cannot be empty",
    }),
    user_name: Joi.string().min(5).messages({
      "string.base": "Username should be string",
      "string.empty": "Username cannot be empty",
    }),
    phone: Joi.string().min(11).max(11).messages({
      "string.base": "Phone Number should be string",
      "string.empty": "Phone Number cannot be empty",
      "string.min": "Phone Number is Invalid",
      "string.max": "Phone Number is Invalid",
    }),
    account_name: Joi.string().messages({
      "string.base": "Account name should be string",
      "string.empty": "Account name cannot be empty",
    }),
    account_number: Joi.string().min(10).max(10).messages({
      "string.base": "Account should be string",
      "string.min": "Account number is Invalid",
      "string.max": "Account number is Invalid",
      "string.empty": "Account number cannot be empty",
    }),
    account_bank: Joi.string().messages({
      "string.base": "Bank name should be a string",
      "string.empty": "Bank name cannot be empty",
    }),
  });

  return profileSchema.validateAsync(data, { abortEarly: false });
};

profileValidation.validateChangePassword = (data) => {
  const validateChangePasswordSchema = Joi.object({
    current_password: Joi.string().required().messages({
      "string.base": "current password should be a string",
      "string.empty": "current password cannot be empty",
      "any.required": "current password is required",
    }),
    new_password: Joi.string().min(6).required().messages({
      "string.base": "new password must be a string",
      "string.empty": "new password field is required",
      "any.required":
        "new password is required and should be greater than 6 characters",
    }),
  });

  return validateChangePasswordSchema.validateAsync(data, {
    abortEarly: false,
  });
};

module.exports = profileValidation;
