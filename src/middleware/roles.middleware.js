const roles = require("../datas/roles.data");
const Response = require("../utils/errorResponse");
const validateErrorFormatter = require("../utils/validateErrorFormatter");

exports.canUploadMiddleware = (request, reply, next) => {
  if (roles[request.user.permission].includes("canUploadBooks")) {
    return next();
  }
  return Response.INVALID_REQUEST({
    response: reply,
    message: "Not Authorized To Upload Notes",
  });
};
