const Profile = require("../data-access/profile.dao");
const Account = require("../data-access/account.dao");
const fileSystem = require("../services/file-system");
const User = require("../data-access/user.dao");
const bcryptUtils = require("../utils/bcryptUtils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ errorFormat: "minimal" });
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

const getStartDate = (period) => {
    const now = new Date();
    switch (period) {
      case 'last_7_days':
        return new Date(now.setDate(now.getDate() - 7));
      case 'last_1_month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'last_3_months':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'last_6_months':
        return new Date(now.setMonth(now.getMonth() - 6));
      case 'last_1_year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case 'previous_last_7_days':
        return new Date(now.setDate(now.getDate() - 14));
      case 'previous_last_1_month':
        return new Date(now.setMonth(now.getMonth() - 2));
      case 'previous_last_3_months':
        return new Date(now.setMonth(now.getMonth() - 6));
      case 'previous_last_6_months':
        return new Date(now.setMonth(now.getMonth() - 12));
      case 'previous_last_1_year':
        return new Date(now.setFullYear(now.getFullYear() - 2));
      default:
        return new Date();
    }
  }

  const formatDate = (date, period) => {
    const options = { month: 'short', year: 'numeric' };
    switch (period) {
      case 'last_7_days':
      case 'previous_last_7_days':
        return date.toISOString().split('T')[0];
      case 'last_1_month':
      case 'last_3_months':
      case 'previous_last_1_month':
      case 'previous_last_3_months':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toISOString().split('T')[0]} to ${endOfWeek.toISOString().split('T')[0]}`;
      case 'last_6_months':
      case 'last_1_year':
      case 'previous_last_6_months':
      case 'previous_last_1_year':
        return date.toLocaleDateString('en-US', options);
      default:
        return date.toISOString().split('T')[0];
    }
  };

  const getNextDate = (date, period) => {
    const newDate = new Date(date);
    switch (period) {
      case 'last_7_days':
      case 'previous_last_7_days':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'last_1_month':
      case 'last_3_months':
      case 'previous_last_1_month':
      case 'previous_last_3_months':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'last_6_months':
      case 'last_1_year':
      case 'previous_last_6_months':
      case 'previous_last_1_year':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    return newDate;
  };

  profileService.getTransactionPerformance = async ({ params, user }) => {
    const startDate = getStartDate(params.period);
    const now = new Date();

    // Get transactions for the specified period
    const transactions = await prisma.book_transactions.findMany({
      where: {
        owner: user.id,
        createdAt: {
          gte: startDate,
          lte: now,
        },
        status: 'CONFIRMED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Get transactions for the previous equivalent period to calculate percentage change
    const previousStartDate = getStartDate(`previous_${params.period}`);
    const previousTransactions = await prisma.book_transactions.findMany({
      where: {
        owner: user.id,
        createdAt: {
          gte: previousStartDate,
          lte: startDate,
        },
        status: 'CONFIRMED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Create a map for the specified period
    const dataMap = {};
    for (let d = new Date(startDate); d <= now; d = getNextDate(d, params.period)) {
      const dateKey = formatDate(d, params.period);
      dataMap[dateKey] = { sales: 0, earnings: 0 };
    }

    // Populate the map with transaction data
    transactions.forEach(transaction => {
      const dateKey = formatDate(transaction.createdAt, params.period);
      dataMap[dateKey].sales += 1;
      dataMap[dateKey].earnings += transaction.amount;
    });

    // Convert the map to arrays and calculate total sales and earnings
    const salesPerDay = [];
    const earningsPerDay = [];
    let totalSales = 0;
    let totalEarnings = 0;
    for (const dateKey in dataMap) {
      salesPerDay.push(dataMap[dateKey].sales);
      earningsPerDay.push(dataMap[dateKey].earnings);
      totalSales += dataMap[dateKey].sales;
      totalEarnings += dataMap[dateKey].earnings;
    }

    // Calculate total earnings for the previous period
    let previousTotalEarnings = 0;
    previousTransactions.forEach(transaction => {
      previousTotalEarnings += transaction.amount;
    });

    // Calculate percentage change in earnings
    const earningsChangePercentage = previousTotalEarnings
      ? ((totalEarnings - previousTotalEarnings) / previousTotalEarnings) * 100
      : 0;

    return {
      salesPerDay,
      earningsPerDay,
      totalSales,
      totalEarnings,
      earningsChangePercentage
    };
};

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
