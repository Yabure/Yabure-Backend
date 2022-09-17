const { default: axios } = require("axios");
const Plan = require("../data-access/plan.dao");
const User = require("../data-access/user.dao");

const paymentService = {
  initializeTransaction: async (body) => {
    if (!body) throw new Error("no request body");

    const { email, planId } = body;
    if (!email || !planId) throw new Error("PlanId and Email is required");

    const result = await Plan.findByPlanId(planId);
    if (!result) throw new Error("Plan does not exist");

    const params = JSON.stringify({
      email: email,
      amount: result.amount,
      plan: result.plan_code,
    });

    console.log(params);

    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        params,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return { checkout: response.data.data.authorization_url };
    } catch (error) {
      console.log(error.response.data.message);
      throw new Error("OOps!! something went wrong");
    }
  },

  getAllSubscription: async () => {
    const result = await Plan.findAll();
    return result;
  },

  addpayment: async (req) => {
    console.log(req.body);
    if (!req.body || !req.body.plan_code) throw new Error("no plan provided");

    const data = {
      plan_code: req.body.plan_code.trim(),
      subscribed: true,
    };

    await User.update(req.user.id, data);

    return;
  },
};

module.exports = paymentService;
