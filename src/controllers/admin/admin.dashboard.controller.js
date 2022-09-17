const authValidation = require("../../validators/auth.validator");
const validateErrorFormatter = require("../../utils/validateErrorFormatter");
const authService = require("../../services/auth.service");
const Response = require("../../utils/errorResponse");
const {
  getDashboardData,
} = require("../../services/admin/admin.dashboard.service");

const adminDashboardController = {};

adminDashboardController.getDashboardData = async (request, response) => {
  try {
    const result = await getDashboardData();
    return Response.SUCCESS({
      data: result,
      response,
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

module.exports = adminDashboardController;
