const Interest = require("../data-access/interest.dao")
const UserInterest = require("../data-access/userInterest.dao")
const ratingService = require("./rating.service")

const userInterestService = {}

userInterestService.storeInterest = async({interests}, user) => {
    const res = await Interest.findByInterest(interests)
    if(!res) throw new Error("Specified Interests Does Not Exists")

    const interest = await UserInterest.insert(user, res)
    return interest
}


userInterestService.addRatings = async (body) => {
    await ratingService.rate(body)
    return
}

module.exports = userInterestService 