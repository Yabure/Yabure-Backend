const validateErrorFormatter = require("../utils/validateErrorFormatter")
const Response = require("../utils/errorResponse")
// const interestValidation = require("../validators/interest.Validation")
// const userInterestService = require("../services/user.service")
const { requestPermission, sendPushNotification, activateNotification } = require("../services/notification.service")

const notification = {}

notification.activate = async (req, res) => {
    try{
        await activateNotification(req)
        return Response.SUCCESS({ response: res, data: "Notification Activated Successfully"})
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

notification.requestPermission = async (req, res) => {
    try{
        await requestPermission()
        return Response.SUCCESS({ response: res, data: "Interest added successfully"})
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

notification.sendNotification = async (req, res) => {
    try{
        const devices = [
            "eBJp_E-zMnM:APA91bEKDqqjr2mWU7Gvovnadyl2IquxTYD3rz03RCMHgM2Mq2tss-EO5x6OkJMkmI0a0w3fBsVhkPijuc1ahO35EpmI7owd0IsOFmeXNVVemQHAIROrdNGeecF7StrthLVd9KgE4U7Z",
            "dmDBf-pVL5c:APA91bFzjsQkJ8Qtw3XTc-V5ADNnJpQLXb4JxR6MIpUucblOEXNIev_kplkEEqIJqBx_I6CxUCA9Biz0szXOitT2O-uSHj6TZ7ExpfILgbViEOLoGbhK8qXM8fQs0X4gAzZNOp8Db-O6"

        ]

        devices.forEach(dev => {
            const message = {
                notification: {
                    title: "Testing boss",
                    body: "just testing stuff"
                },
                token: dev
            }
            sendPushNotification(message)
        })

        await sendPushNotification(message)
        return Response.SUCCESS({ response: res, data: "sent successfully"})
    } catch(err) {
       const errors = await validateErrorFormatter(err) 
       return Response.INVALID_REQUEST({ response: res, errors})
    }
}

module.exports = notification