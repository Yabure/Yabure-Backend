const rules = require("./ruleData")

const seedRules = async (prisma) => {
  for (let rule of rules){
    await prisma.rules.upsert({
        where: {
            type: rule.type,
          },
          update: {
            rule: rule.rule
          },
          create: {
            type: rule.type,
            rule: rule.rule,
          },
    })
  }

}

module.exports = seedRules