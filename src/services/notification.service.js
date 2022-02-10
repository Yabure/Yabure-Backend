// const { messaging } = require("firebase-admin")
const admin = require("firebase-admin");
const path = require("path");
const Notification = require("../data-access/notification.dao");
const User = require("../data-access/user.dao");

const pathToSDK = path.resolve("./firebase_sdk_config.json");

const serviceAccount = require(pathToSDK);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const messaging = admin.messaging();

const sendPushNotification = async (message) => {
  try {
    message.notification.imageUrl =
      "https://res.cloudinary.com/dpregnexq/image/upload/v1637790549/logo_xxfj3n.png";
    await messaging.send(message);
  } catch (error) {
    console.log(error);
    // throw new Error("Something Went Wrong")
  }
};

const activateNotification = async ({ user, body }) => {
  if (body && body.token) {
    const userData = await User.findById(user);
    let devices;
    if (userData.devices === null) {
      devices = [];
    }
    devices = userData.devices;
    if (!devices.includes(body.token)) {
      devices.push(body.token);
      await User.update(user, { devices });
    }

    return;
  }

  throw new Error("Token is required");
};

const getNotifications = async ({ user }) => {
  const notifications = await Notification.findById(user);
  return notifications;
};

module.exports = {
  sendPushNotification,
  activateNotification,
  getNotifications,
};
