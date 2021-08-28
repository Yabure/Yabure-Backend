const proflieController = require("../controllers/profile.controller")

const rule = (fastify, options, next) => {
    fastify.get("/", proflieController.getProfile)
    fastify.post("/upload", proflieController.uploadPicture);
    fastify.post("/", proflieController.addProfile);
    next();
}

module.exports = rule