const notificationController = require("../controllers/notification.controller");

const notification = (fastify, options, next) => {
  fastify.get("/notification", notificationController.getNotifications);
  next();
};

module.exports = notification;
