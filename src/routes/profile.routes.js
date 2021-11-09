const profileController = require("../controllers/profile.controller");

const profile = (fastify, options, next) => {
    fastify.get("/", profileController.getProfile)
    fastify.get("/:id", profileController.getProfile)
    fastify.post("/upload", profileController.uploadPicture);
    fastify.post("/", profileController.addProfile);
    fastify.post("/change-password", profileController.changePassword)
    next();
}

module.exports = profile