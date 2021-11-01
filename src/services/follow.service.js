const Followers = require("../data-access/followers.dao");

const FollowersService = {}


FollowersService.follow = async ({user, query}) => {

    if(user === query.userId) throw new Error("you can't follow yourself");
    if(!query || !query.userId) throw new Error("userId is required");

    const { userId } = query

    const { followers } = await Followers.findByUserId(userId)

    if(followers.includes(user)) throw new Error("You are currently following this user")
    followers.push(user)

    await Followers.update(userId, { followers })


    return
}


module.exports = FollowersService