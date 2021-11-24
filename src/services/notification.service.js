    // const { messaging } = require("firebase-admin")
    const admin = require("firebase-admin")
    const path = require("path")
const User = require("../data-access/user.dao")

    const pathToSDK = path.resolve("./firebase_sdk_config.json")

    const serviceAccount = require(pathToSDK)

    const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    })


    const messaging = admin.messaging()

    



    const requestPermission = () => {
 
    }


    const sendPushNotification = async (message) => {
        console.log(message)
        try {
            const res = await messaging.send(message)
            console.log(res)
        }catch(error) {
            console.log(error)
        }
    }


    const activateNotification = async ({user, body}) => {
        if(body && body.token) {
            const userData = await User.findById(user)
            let devices;
            if(userData.devices === null) {
                devices = []
            }
            devices = userData.devices
            if(!devices.includes(body.token)){
                devices.push(body.token)
                await User.update(user, {devices})
            }

            return
        }

        throw new Error("Token is required")
    }
    

    module.exports = {
        requestPermission,
        sendPushNotification,
        activateNotification,
    }