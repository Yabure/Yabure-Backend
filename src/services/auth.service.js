const _ = require("lodash");
const bcryptUtils = require("../utils/bcryptUtils");
const jwtUtils = require("../utils/token.utils");
const User = require("../data-access/user.dao");
const mail = require("./mail.service");
const token = require("./token.service");
const { v4: uuidv4 } = require("uuid");
const validateErrorFormatter = require("../utils/validateErrorFormatter");
const addDateToCurrentDate = require("../utils/date");

const authService = {};

authService.register = async (data) => {
  try {
    const user = await User.findByEmail(data.email);
    if (user) throw new Error("user already exists");
    data.password = bcryptUtils.hashPassword(data.password);
    data.isVerified = false;
    data.subscribed = true;
    data.role = "USER";
    data.expire = addDateToCurrentDate(7);

    const newUser = await User.insert(data);
    return newUser;
  } catch (error) {
    console.log(error);
    const err = validateErrorFormatter(error);
    if (err !== "user already exists")
      throw new Error(
        "Sorry, we couldn't create your account at this time, try again later"
      );
    throw new Error(err);
  }
};

authService.adminRegisterUser = async (data) => {
  const mailData = { ...data };
  try {
    const user = await User.findByEmail(data.email);
    if (user) throw new Error("User already exists");
    data.password = bcryptUtils.hashPassword(data.password);
    data.isVerified = true;
    data.subscribed = true;
    data.role = "MODERATOR";

    const newUser = await User.insert(data);

    mail.modAccountCreatedEmail({
      name: mailData.firstName,
      email: mailData.email,
      password: mailData.password,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    const err = validateErrorFormatter(error);
    if (err.toLowerCase() !== "user already exists")
      throw new Error(
        "Sorry, we couldn't create your account at this time, try again later"
      );
    throw new Error(err);
  }
};

authService.login = async (data, password) => {
  try {
    const user = await User.findByEmail(data.email);
    if (!user) throw new Error("User does not exists");

    data.password = password ? password : data.password;
    const validPassword = await bcryptUtils.verifyPassword(
      data.password,
      user.password
    );
    if (!validPassword) throw new Error("invalid email or password");

    if (!user.isVerified) {
      const verifyToken = await token.generateVerificationToken(user.email);
      await mail.sendVerificationEmail(user, verifyToken);
      return { data: _.pick(user, ["firstName", "isVerified", "email"]) };
    }

    const authToken = jwtUtils.generateToken({
      id: user.id,
      subscribed: user.subscribed,
      expire: user.expire,
      role: user.role,
    });

    return {
      authToken,
      data: _.pick(user, [
        "subscribed",
        "profile",
        "isVerified",
        "role",
        "can_upload",
      ]),
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

authService.registerAndLogin = async (user) => {
  try {
    const unHashedPass = user.password;
    const newUser = await authService.register(user);
    const { authToken, data } = await authService.login(newUser, unHashedPass);
    return { authToken, data };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

authService.verifyUser = async (data) => {
  if (!data.email || !data.token) throw new Error("Token or Email is empty");
  const user = await User.findByEmail(data.email);
  if (!user) throw new Error("User does not exists");

  const verified = await token.verifyUserToken(data.email, data.token);
  if (!verified) throw new Error("Invalid Token");

  await User.updateUserVerification(data.email);

  const authToken = jwtUtils.generateToken({
    id: user.id,
    subscribed: user.subscribed,
    expire: user.expire,
    role: user.role,
  });

  return { authToken };
};

authService.resendVerification = async ({ email }) => {
  const user = await User.findByEmail(email);
  if (!user) throw new Error("User does not exists");

  if (user.isVerified) throw new Error("User already verified");

  const verifyToken = await token.generateVerificationToken(user.email);
  await mail.sendVerificationEmail(user, verifyToken);
  return true;
};

authService.forgotPassword = async ({ email }) => {
  try {
    const id = uuidv4();
    const user = await User.updateByEmail(email, {
      reset: id,
    });

    await mail.sendForgotPasswordEmail(email, id);
    return user;
  } catch (error) {
    console.log(error);
  }
};

authService.resetPassword = async ({ key, password }) => {
  try {
    const user = await User.updateByResetId(key, {
      password: bcryptUtils.hashPassword(password),
      reset: null,
    });

    // await mail.sendForgotPasswordEmail(email, id)
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = authService;
