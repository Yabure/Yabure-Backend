const adminDashboardController = require("../controllers/admin/admin.dashboard.controller");
const adminAuthController = require("../controllers/admin/auth.admin.controller");
const { isAdmin } = require("../middleware/roles.middleware");

const auth = (fastify, options, next) => {
  fastify.post(
    "/auth/register",
    { preHandler: [isAdmin] },
    adminAuthController.register
  );
  fastify.get(
    "/dashboard",
    { preHandler: [isAdmin] },
    adminDashboardController.getDashboardData
  );
  next();
};

module.exports = auth;
