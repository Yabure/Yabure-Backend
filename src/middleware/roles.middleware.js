const roles = require("../datas/roles.data");
const Response = require("../utils/errorResponse");
const validateErrorFormatter = require("../utils/validateErrorFormatter");

exports.canUploadMiddleware = (request, reply, next) => {
  if (roles[request.user.role].includes("canUploadBooks")) {
    return next();
  }
  return Response.INVALID_REQUEST({
    response: reply,
    message: "Not Authorized To Upload Notes",
  });
};

exports.isAdmin = (request, reply, next) => {
  if (!request.user.role === "ADMIN")
    return Response.INVALID_REQUEST({
      response: reply,
      message: "Unauthorized",
    });
  if (
    !request.headers.auth_key ||
    request.headers.auth_key !== process.env.AUTH_KEY
  )
    return Response.INVALID_REQUEST({
      response: reply,
      message: "Invalid Key",
    });

  return next();
};
