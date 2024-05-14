const Response = require("../../utils/errorResponse");
const validateErrorFormatter = require("../../utils/validateErrorFormatter");
const subscriptionWebhook = require("./subscription.service");

const subscriptionController = {
  subscriptionWebhook: async (req, res) => {
    try {
      const data = await subscriptionWebhook.subscriptionWebhook(req.body);
      return Response.SUCCESS({ response: res, data });
    } catch (err) {
      console.log(err);
      const errors = await validateErrorFormatter(err);
      return Response.INVALID_REQUEST({ response: res, errors });
    }
  },
};

module.exports = subscriptionController;
