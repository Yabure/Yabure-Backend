const jwtUtils = require("../utils/token.utils");
const Response = require("../utils/errorResponse");
const validateErrorFormatter = require("../utils/validateErrorFormatter");
const User = require("../data-access/user.dao");

const SESSION_NAME = process.env.SESSION_NAME;

exports.isLoggedIn = (fastify) => {
  const publicRoute = ["auth", "interests", "rules", "webhook", "key"];

  fastify.addHook("preValidation", async (request, response) => {
    if (!request.routerPath)
      Response.INVALID_REQUEST({ response, errors: "Route Does Not Exist" });
    const routePath = request.routerPath.split("/");
    const route =
      publicRoute.includes(routePath[2]) || publicRoute.includes(routePath[1])
        ? routePath[2]
        : "";
    if (route === "") {
      try {
        if (request.cookies[SESSION_NAME]) {
          const user = jwtUtils.decrypt(request.cookies[SESSION_NAME]);
          await isSubscribed(user);
          return (request.user = user);
        }
        throw new Error("Unauthorized");
      } catch (err) {
        console.log(err);
        const error = validateErrorFormatter(err);
        return Response.UNAUTHORIZED({
          response,
          message: error ? error : "Unauthorized",
          subscribed: false,
        });
      }
    }
    return;
  });
};

const isSubscribed = async (user) => {
  if (!user.expire) throw new Error("Your Subscription has expired");

  if (new Date(user.expire) < Date.now()) {
    const result = await User.countAll({
      subscribed: {
        equals: false,
      },
      expire: {
        equals: user.expire,
      },
      id: {
        equals: user.id,
      },
    });
    if (result > 0) throw new Error("Your Subscription has expired");
  }

  return;
};
