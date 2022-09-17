const validateErrorFormatter = require("../utils/validateErrorFormatter");
const profileService = require("../services/profile.service");
const Response = require("../utils/errorResponse");
const profileValidation = require("../validators/profile.validator");

const profileController = {};

profileController.uploadPicture = async (req, res) => {
  try {
    await profileService.uploadProfilePicture(req);
    Response.SUCCESS({
      response: res,
      data: {},
      message: "profile picture added successfully",
    });
  } catch (error) {
    const errors = validateErrorFormatter(error);
    return Response.INVALID_REQUEST({ response: res, errors });
  }
};

profileController.getProfile = async (req, res) => {
  try {
    if (req.params && req.params.id) {
      const profile = await profileService.getProfileById(req);
      return Response.SUCCESS({ response: res, data: profile });
    }
    const profile = await profileService.getProfile(req);
    return Response.SUCCESS({ response: res, data: profile });
  } catch (error) {
    const errors = validateErrorFormatter(error);
    return Response.INVALID_REQUEST({ response: res, errors });
  }
};

profileController.addProfile = async (req, res) => {
  try {
    const validatedData = await profileValidation.validateProfile(req.body);
    await profileService.addProfile(req, validatedData);
    Response.SUCCESS({
      response: res,
      data: {},
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    const errors = validateErrorFormatter(error);
    return Response.INVALID_REQUEST({ response: res, errors });
  }
};

profileController.changePassword = async (req, res) => {
  try {
    const validatedData = await profileValidation.validateChangePassword(
      req.body
    );
    await profileService.changePassword(req, validatedData);
    Response.SUCCESS({
      response: res,
      data: {},
      message: "Password Updated Successfully",
    });
  } catch (error) {
    const errors = validateErrorFormatter(error);
    return Response.INVALID_REQUEST({ response: res, errors });
  }
};

module.exports = profileController;
