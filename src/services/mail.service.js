const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
    auth: {
        api_key: process.env.SENDGRID_KEY
    }
}

const mailer = nodemailer.createTransport(sgTransport(options));

const mail = {}

mail.sendVerificationEmail = async (user, token) => {
    const email = {
        to: [`${user.firstName}`, `${user.email}`],
        from: `${process.env.SENDGRID_EMAIL_SENDER}`,
        subject: 'Verify your email',
        text: 'confirm that it is you',
        html: `Here is your confirmation token <b>${token}</b>`
    };
    await mailer.sendMail(email).then(() => {
        return true
    }).catch((err) => {
        throw new Error(err)
    })
}

module.exports = mail