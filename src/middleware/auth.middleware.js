const jwtUtils = require("../utils/token.utils");
const Response = require("../utils/errorResponse");
const validateErrorFormatter = require("../utils/validateErrorFormatter");


const authMiddleWare = (fastify) => {
    const SESSION_NAME = process.env.SESSION_NAME
    const publicRoute = ["auth", "interests", "rules", "webhook"]

    fastify.addHook("preValidation", async (request, response) => {
        if(!request.routerPath) Response.INVALID_REQUEST({response, errors: "Route Does Not Exist"})
        const routePath = request.routerPath.split("/")
        console.log(request.cookies[SESSION_NAME])
        const route = publicRoute.includes(routePath[2]) || publicRoute.includes(routePath[1]) ? routePath[2] : ''
        if(route === '') {
            try {
                if(request.cookies[SESSION_NAME]) {
                    const user = jwtUtils.decrypt(request.cookies[SESSION_NAME])
                    if(!user.subscribed) throw new Error("You haven't subscribed or your subcription has expired")
                    console.log(user, "wwww")
                    // console.log(user)
                    return request.user = user.id
                }
                throw new Error("Unauthorized")
            } catch (err) {
                const error = validateErrorFormatter(err)
                return Response.UNAUTHORIZED({response, errors: 
                    error ? error : "Unauthorized",
                    subscribed: false
                })
            }
        }
        // console.log("here")
        return;
    });
}

module.exports = authMiddleWare