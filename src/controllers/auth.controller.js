const authValidation = require("../validators/auth.validator");
const validateErrorFormatter = require("../utils/validateErrorFormatter");
const authService = require("../services/auth.service");
const Response = require("../utils/errorResponse");
const { encryptData } = require("../utils/crypto");
// const addDateToCurrentDate = require("../utils/date");

const CookieOptions = {
  path: "/",
  name: "stuff",
  // secure: process.env.ENVIRONMENT !== "development" ? true : false,
  secure: false,
  // sameSite: process.env.ENVIRONMENT !== "development" ? "Strict" : "None",
  sameSite: "None",
  resave: true,
  saveUninitialized: true,
  // httpOnly: true,
};

const authController = {};

authController.register = async (request, response) => {
  try {
    const validatedData = await authValidation.registerValidation(request.body);
    const { authToken, data } = await authService.registerAndLogin(
      validatedData
    );

    response.cookie(process.env.SESSION_NAME, authToken, {
      ...CookieOptions,
    });
    return Response.SUCCESS({
      response,
      data,
      message: "Registered Successfully",
    });
  } catch (err) {
    const errors = validateErrorFormatter(err);

    console.log(err);
    return Response.INVALID_REQUEST({
      response,
      message: errors,
      subscribed: false,
    });
  }
};

authController.login = async (request, response) => {
  try {
    const { authToken, data } = await authService.login(request.body);
    if (Object.keys(data).length !== 0 && !data.isVerified) {
      return Response.INVALID_REQUEST({
        response,
        errors: data,
        subscribed: false,
      });
    }

    response.cookie(process.env.SESSION_NAME, authToken, {
      ...CookieOptions,
    });
    return Response.SUCCESS({
      response,
      data,
      messsage: "Logged In Successfully",
      subscribed: data.subscribed,
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

authController.verifyUser = async (request, response) => {
  try {
    const { authToken } = await authService.verifyUser(request.query);
    response.cookie(process.env.SESSION_NAME, authToken, {
      ...CookieOptions,
    });
    return Response.SUCCESS({
      response,
      data: {},
      message: "Verified Successfully",
    });
  } catch (err) {
    const errors = validateErrorFormatter(err);
    return Response.INVALID_REQUEST({ response, errors, subscribed: false });
  }
};

authController.resendVerification = async (request, response) => {
  try {
    await authService.resendVerification(request.query);

    return Response.SUCCESS({
      response,
      data: {},
      message: "Sent Successfully",
    });
  } catch (err) {
    const errors = validateErrorFormatter(err);
    return Response.INVALID_REQUEST({ response, errors, subscribed: false });
  }
};

authController.forgotPassword = async (request, response) => {
  try {
    await authService.forgotPassword(request.query);

    return Response.SUCCESS({
      response,
      data: {},
      message: "Sent Successfully",
    });
  } catch (err) {
    const errors = validateErrorFormatter(err);
    return Response.INVALID_REQUEST({ response, errors });
  }
};

authController.resetPassword = async (request, response) => {
  try {
    await authService.resetPassword(request.body);

    return Response.SUCCESS({
      response,
      data: {},
      message: "Sent Successfully",
    });
  } catch (err) {
    const errors = validateErrorFormatter(err);
    return Response.INVALID_REQUEST({ response, errors });
  }
};

authController.logOut = async (request, response) => {
  try {
    response.cookie(
      process.env.SESSION_NAME,
      {},
      {
        path: "/",
        name: "amiunwuienuf394j024j92n4in2i",
        resave: true,
        saveUninitialized: true,
        httpOnly: true,
        secure: false,
        sameSite: "None",
        expires: new Date(),
      }
    );
    return Response.SUCCESS({
      response,
      data: {},
      message: "Logged Out Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = authController;
