const { default: axios } = require("axios")
const Plan = require("../data-access/plan.dao");
    

const paymentService = {
    initializeTransaction: async (body) => {
        if(!body) throw new Error("no request body");

        const {email, planId} = body
        if(!email || !planId) throw new Error("PlanId and Email is required");

        const result = await Plan.findByPlanId(planId)
        if(!result) throw new Error("Plan does not exist")

        console.log(result)


        // const params = JSON.stringify({
        //   email: email,
        //   amount: result.amount,
        //   plan_code: result.plan_code
        // })

        const params = JSON.stringify({
          email: email,
          amount: "200000",
          plan: "PLN_14t1xyc2cp01vu6"
        })

        console.log(process.env.PAYSTACK_KEY)

        try {
            const response = await axios.post("https://api.paystack.co/transaction/initialize", params,{
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                    'Content-Type': 'application/json'
                }
            })

            console.log(response.data)
    
            return {checkout: response.data.data.authorization_url}
        } catch (error) {
            console.log(error.response.data.message)
            throw new Error("OOps!! something went wrong")
        }

    },

    getAllSubscription: async() => {
       const result = await Plan.findAll()
       return result
    },
}

module.exports = paymentService