const plans = require("./planData")

const seedPlan = async (prisma) => {
  for (let plan of plans){
    await prisma.plans.upsert({
        where: {
            plan_code: plan.plan_code,
          },
          update: {
            name: plan.name,
            interval: plan.interval,
            amount: plan.amount,
            view_amount: plan.view_amount,
            plan_code:  plan.plan_code
          },
          create: {
            name: plan.name,
            interval: plan.interval,
            amount: plan.amount,
            view_amount: plan.view_amount,
            plan_code:  plan.plan_code
          },
    })
  }

}

module.exports = seedPlan