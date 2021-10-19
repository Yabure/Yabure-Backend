const Rating = require("../data-access/rating.dao");

const ratingService = {}

ratingService.rate = async ({userId, rating}) => {
    if(typeof(rating) !== 'number' || rating > 5 || rating < 1) throw new Error("rating must be a number and should be less than or equal to five")
    const ratingArr = ["one_star", "two_star", "three_star", "four_star", "five_star"]
    const data = {
        userId,
        field: ratingArr[rating - 1]
    }
    await Rating.update(data)

    return
}

ratingService.getUserRating = async ({userId}) => {
    const rating = await Rating.findByUserId(userId)
    if(!rating) return {rating: 0}
    const {one_star, two_star, three_star, four_star, five_star} = rating
    const totalRating = (5*five_star + 4*four_star + 3*three_star + 2*two_star + 1*one_star) / (five_star+four_star+three_star+two_star+one_star)
    return {rating: totalRating.toFixed(1)}
}


module.exports = ratingService