const authValidation = require("../../validators/auth.validator");
const validateErrorFormatter = require("../../utils/validateErrorFormatter");
const authService = require("../../services/auth.service");
const Response = require("../../utils/errorResponse");

const adminAuthController = {};

adminAuthController.register = async (request, response) => {
  console.log(request);
  if (
    !request.headers.auth_key ||
    request.headers.auth_key !== process.env.AUTH_KEY
  ) {
    return Response.INVALID_REQUEST({
      response,
      message: "Unauthorized Key",
      subscribed: false,
    });
  }
  try {
    const validatedData = await authValidation.registerValidation(request.body);
    const data = await authService.adminRegisterUser(validatedData);

    return Response.SUCCESS({
      response,
      data,
      message: "Registered Successfully",
    });
  } catch (err) {
    const errors = validateErrorFormatter(err);
    return Response.INVALID_REQUEST({
      response,
      message: errors,
      subscribed: false,
    });
  }
};

module.exports = adminAuthController;
