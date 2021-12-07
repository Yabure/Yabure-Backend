const jwtUtils = require("../utils/token.utils");
const Response = require("../utils/errorResponse")


const authMiddleWare = (fastify) => {
    const SESSION_NAME = process.env.SESSION_NAME
    const publicRoute = ["auth", "interests", "rules", "yab-webhook"]

    fastify.addHook("preValidation", async (request, response) => {
        if(!request.routerPath) Response.INVALID_REQUEST({response, errors: "Route Does Not Exist"})
        const routePath = request.routerPath.split("/")
        const route = publicRoute.includes(routePath[2]) || publicRoute.includes(routePath[1]) ? routePath[2] : ''
        if(route === '') {
            try {
                const token = request.cookies[SESSION_NAME]
                // console.log(token)
                const user = jwtUtils.decrypt(token)
                // console.log(user)
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