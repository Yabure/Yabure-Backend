const notfication = require("../controllers/notification.controller");
const userController = require("../controllers/user.controller");

const user = (fastify, options, next) => {
  fastify.post("/interests", userController.storeInterest);
  fastify.get("/popular", userController.gtePopularUploaders);
  fastify.post("/notification/activate", notfication.activate);
  fastify.get("/send-notification", notfication.sendNotification);
  fastify.post("/follow", userController.follow);
  fastify.post("/unfollow", userController.unFollow);
  next();
};

module.exports = user;
