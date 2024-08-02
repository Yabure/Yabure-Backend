const profileController = require("../controllers/profile.controller");

const profile = (fastify, options, next) => {
    fastify.get("/", profileController.getProfile)
    fastify.get("/:id", profileController.getProfile)
    fastify.post("/upload", profileController.uploadPicture);
    fastify.post("/", profileController.addProfile);
    fastify.post("/change-password", profileController.changePassword)
    fastify.post("/addViews/:id", profileController.addViews);
    fastify.post("/addLikes/:id", profileController.addLikes);
    fastify.post("/addDislikes/:id", profileController.addDislikes);
    next();
}

module.exports = profile
