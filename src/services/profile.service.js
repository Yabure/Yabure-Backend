const Profile = require("../data-access/profile.dao");
const Account = require("../data-access/account.dao");
const fileSystem = require("../services/file-system");

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

profileService.addProfile = async({user}, data) => {
    console.log(user)
    const userProfile = await Profile.findById(user)
    if(!userProfile) throw new Error("This user profile doesn't exists");
    if(userProfile.username === data.user_name) throw new Error("Username already exists");
    data.userId = user

    await Profile.update(data)
    await Account.update(data)
 
    return userProfile
}

module.exports = profileService