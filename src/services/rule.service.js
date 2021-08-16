const Rule = require("../data-access/rule.dao")

const ruleService = {}

ruleService.getRules = async(type) => {
    const rule = await Rule.findByType(type)
    if(!rule) throw new Error("Specified Rule Type Does Not Existx")

    return rule
}

module.exports = ruleService