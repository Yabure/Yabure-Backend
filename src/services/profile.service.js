const Profile = require("../data-access/profile.dao");
const Account = require("../data-access/account.dao");
const fileSystem = require("../services/file-system");
const User = require("../data-access/user.dao");
const bcryptUtils = require("../utils/bcryptUtils");
const ratingService = require("./rating.service");

const profileService = {};

profileService.uploadProfilePicture = async ({ body, user }) => {
  const userProfile = await Profile.findById(user.id);
  if (!userProfile) throw new Error("This user profile doesn't exists");
  console.log(userProfile);

  if (userProfile.picture !== null)
    fileSystem.deleteFile("profile", userProfile.picture);

  const imgName = await fileSystem.uploadImage(body.picture);
  await Profile.updatePicture(user.id, imgName);

  return true;
};

profileService.getProfile = async ({ user }) => {
  const userProfile = await Profile.findById(user.id);
  if (!userProfile) throw new Error("This user profile doesn't exists");
  const userAccount = await Account.findById(user.id);
  userProfile.accountDetails = userAccount;

  return userProfile;
};

profileService.getProfileById = async ({ params, user }) => {
  const result = await Profile.findById(params.id);
  if (!result) throw new Error("user not found");

  result.following = result.user.followers.followers.includes(user.id)
    ? true
    : false;

  return result;
};

profileService.addProfile = async ({ user }, data) => {
  const userProfile = await Profile.findById(user.id);
  if (!userProfile) throw new Error("This user profile doesn't exists");

  const existingUsername = await Profile.findByUserName(data.user_name);
  if (existingUsername) throw new Error("Username already exists");
  data.userId = user.id;

  await Profile.update(data);
  await Account.update(data);

  return userProfile;
};

profileService.addViews = async ({ params, user }) => {
  const result = await Profile.findById(params.id);
  if (!result) throw new Error("user not found");
  const { views, userId } = result;

  if (!views.includes(user.id) && userId != user.id) {
    views.push(user.id);
  }

  await Profile.updateAny(params.id, views)

  return;
}

profileService.addLikes = async ({ params, user }) => {
    const result = await Profile.findById(params.id);
    if (!result) throw new Error("User not found");

    const { likes, dislikes, userId } = result;

    // Remove from dislikes if already present
    if (dislikes.includes(user.id) && userId != user.id) {
        dislikes.splice(dislikes.indexOf(user.id), 1);
    }

    // Add to likes if not already present
    if (!likes.includes(user.id) && userId != user.id) {
        likes.push(user.id);
    } else {
        throw new Error("User has already liked this profile");
    }

    await result.updateAny(params.id, likes);

    return;
}

profileService.addDislikes = async ({ params, user}) => {
    const result = await Profile.findById(params.id);
    if (!result) throw new Error("User not found");

    const { likes, dislikes, userId } = result;

    // Remove from likes if already present
    if (likes.includes(user.id) && userId != user.id) {
        likes.splice(likes.indexOf(user.id), 1);
    }

    // Add to dislikes if not already present
    if (!dislikes.includes(user.id) && userId != user.id) {
        dislikes.push(user.id);
    } else {
        throw new Error("User has already disliked this profile");
    }

    await result.updateAny(params.id, dislikes);

    return;
}

profileService.changePassword = async ({ user }, data) => {
  const userAccount = await User.findById(user.id);
  if (!userAccount) throw new Error("This user doesn't exists");

  const validPassword = await bcryptUtils.verifyPassword(
    data.current_password,
    userAccount.password
  );
  if (!validPassword) throw new Error("Current password is not correct");

  const newPassword = bcryptUtils.hashPassword(data.new_password);

  await User.updateUserPassword(user.id, newPassword);

  return userAccount;
};

module.exports = profileService;
