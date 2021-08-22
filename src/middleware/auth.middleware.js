const jwtUtils = require("../utils/token.utils");
const Response = require("../utils/errorResponse")


const authMiddleWare = (fastify) => {
    const SESSION_NAME = process.env.SESSION_NAME
    const publicRoute = ["auth", "interests", "rules"]

    fastify.addHook("preValidation", async (request, response) => {
        const routePath = request.routerPath.split("/")
        const route = publicRoute.includes(routePath[2]) || publicRoute.includes(routePath[1]) ? routePath[2] : ''
        if(route === '') {
            try {
                const token = request.cookies[SESSION_NAME]
                const user = jwtUtils.decrypt(token)
                return request.user = user.id
            } catch (err) {
                return Response.INVALID_REQUEST({response, errors: "Unauthorized"})
            }

        }
        // console.log("here")
        return;
    });
}

module.exports = authMiddleWare