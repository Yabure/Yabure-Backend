const Interest = require("../data-access/interest.dao")
const User = require("../data-access/user.dao")
const UserInterest = require("../data-access/userInterest.dao")
const ratingService = require("./rating.service")

const userService = {}

userService.storeInterest = async({interests}, user) => {
    const res = await Interest.findByInterest(interests);
    if(!res) throw new Error("Specified Interests Does Not Exists");

    const interest = await UserInterest.insert(user, res);
    return interest;
}


userService.addRatings = async (body) => {
    await ratingService.rate(body);
    return;
}

userService.gtePopularUploaders = async () => {
   const result = await User.findPopularUploaders();

   const sortedData = result.sort((a, b) => {
    return b.average_rating - a.average_rating
   });

   return sortedData
}



module.exports = userService 