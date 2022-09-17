// const Plan = require("../../data-access/plan.dao");
const User = require("../../data-access/user.dao");

const subscriptionWebhook = {
    subscriptionWebhook: async(body) => {
        try {
            const { email } = body.data.customer
            if(body.event === 'charge.success' || body.event === 'subscription.create') {
                const { plan_code } = body.data.plan
                try {
                    await User.updateByEmail(email, {
                        subscribed: true,
                        plan_code
                    })
                    return true
                } catch (error) {
                    console.log(error)
                    return false
                }
            }

            await User.updateByEmail(email, {
                subscribed: false,
            })
            return true

        } catch(error) {
            console.log(error)
            return false
        }
    }
}

module.exports = subscriptionWebhook