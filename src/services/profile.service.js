const Profile = require("../data-access/profile.dao");
const Account = require("../data-access/account.dao");
const fileSystem = require("../services/file-system");
const User = require("../data-access/user.dao");
const bcryptUtils = require("../utils/bcryptUtils");
const ratingService = require("./rating.service");

const profileService = {}

profileService.uploadProfilePicture = async({body, user}) => {
    const userProfile = await Profile.findById(user)
    if(!userProfile) throw new Error("This user profile doesn't exists");

    if(userProfile !== "null") fileSystem.deleteFile("profile", userProfile.picture)

    const imgName = await fileSystem.uploadImage(body.picture)
    await Profile.updatePicture(user, imgName)
    

    return true
}

profileService.getProfile = async({user}) => {
    const userProfile = await Profile.findById(user)
    if(!userProfile) throw new Error("This user profile doesn't exists");
    const userAccount = await Account.findById(user)
    userProfile.accountDetails = userAccount

    return userProfile
}

profileService.getProfileById = async ({id}) => {
    const result = await  Profile.findById(id)
    if(!result) throw new Error("user not found")
    return result
}

profileService.addProfile = async ({user}, data) => {
    const userProfile = await Profile.findById(user)
    if(!userProfile) throw new Error("This user profile doesn't exists");

    const existingUsername = await Profile.findByUserName(data.user_name)
    if(existingUsername) throw new Error("Username already exists");
    data.userId = user

    await Profile.update(data)
    await Account.update(data)
 
    return userProfile
}

profileService.changePassword = async ({user}, data) => {
    const userAccount = await User.findById(user);
    if(!userAccount) throw new Error("This user doesn't exists");

    const validPassword = await bcryptUtils.verifyPassword(data.current_password, userAccount.password)
    if(!validPassword) throw new Error("Current password is not correct");

    const newPassword = bcryptUtils.hashPassword(data.new_password)

    await User.updateUserPassword(user, newPassword)

    return userAccount
}


module.exports = profileService