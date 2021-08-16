const Interest = require("../data-access/interest.dao")

const interestService = {}

interestService.getAllInterest = async(type) => {
    const interest = await Interest.findAll()
    if(!interest) throw new Error("Specified Rule Type Does Not Existx")

    return interest
}

module.exports = interestService