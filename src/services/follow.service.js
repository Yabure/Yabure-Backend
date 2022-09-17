const Followers = require("../data-access/followers.dao");
const { removeOneFromArray } = require("../utils/helpers");

const FollowersService = {};

FollowersService.follow = async ({ user, query }) => {
  console.log(user.id);
  console.log(query.userId);
  if (user.id === query.userId) throw new Error("you can't follow yourself");
  if (!query || !query.userId) throw new Error("userId is required");

  const { userId } = query;

  const followersData = await Followers.findByUserId(userId);
  console.log(followersData);
  if (!followersData)
    throw new Error("User does not exist or account may be deleted");

  const { followers } = followersData;

  if (followers.includes(user.id))
    throw new Error("You are currently following this user");
  followers.push(user.id);

  await Followers.update(userId, { followers });

  return;
};

FollowersService.unFollow = async ({ user, query }) => {
  if (!query || !query.userId) throw new Error("userId is required");

  const { userId } = query;

  const { followers } = await Followers.findByUserId(userId);

  if (!followers.includes(user.id))
    throw new Error("You are currently not following this user");

  const newFollwers = await removeOneFromArray(followers, user.id);

  await Followers.update(userId, { followers: newFollwers });

  return;
};

module.exports = FollowersService;
