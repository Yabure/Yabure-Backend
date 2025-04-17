const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const options = {
  auth: {
    api_key: process.env.SENDGRID_KEY,
  },
};

const mailer = nodemailer.createTransport(sgTransport(options));
mailer.use(
  "compile",
  hbs({
    viewEngine: {
      partialsDir: path.join(__dirname, "../views/"),
      layoutsDir: path.join(__dirname, "../views/"),
      defaultLayout: "",
    },
    viewPath: path.join(__dirname, "../views/"),
  })
);

const mail = {};

// mail.sendVerificationEmail = async (user, token) => {
//     const email = {
//         to: [`${user.firstName}`, `${user.email}`],
//         from: `${process.env.SENDGRID_EMAIL_SENDER}`,
//         subject: 'Verify your email',
//         text: 'confirm that it is you',
//         html: `Here is your confirmation token <b>${token}</b>`
//     };
//     await mailer.sendMail(email).then(() => {
//         return true
//     }).catch((err) => {
//         throw new Error(err)
//     })
// }

mail.sendVerificationEmail = async (user, token) => {
  const data = {
    to: [`${user.email}`],
    from: `${process.env.SENDGRID_EMAIL_SENDER}`,
    subject: "Verify Your Email",
    template: "token",
    context: {
      token,
      firstName: user.profile.fullName.split(" ")[0],
    },
  };
  await mailer
    .sendMail(data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// New method for sending password reset OTP
mail.sendPasswordResetOTP = async (email, token) => {
  const data = {
    to: [`${email}`],
    from: `${process.env.SENDGRID_EMAIL_SENDER}`,
    subject: "Password Reset Code",
    template: "password-reset",
    context: {
      token
    },
  };
  await mailer
    .sendMail(data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

mail.modAccountCreatedEmail = async (user) => {
  const data = {
    to: [`${user.email}`],
    from: `${process.env.SENDGRID_EMAIL_SENDER}`,
    subject: "Here Are Your Credentials",
    template: "mod-account",
    context: {
      password: user.password,
      email: user.email,
      firstName: user.name,
    },
  };
  await mailer
    .sendMail(data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

mail.sendForgotPasswordEmail = async (email, key) => {
  const data = {
    to: [`${email}`],
    from: `${process.env.SENDGRID_EMAIL_SENDER}`,
    subject: "Password Reset",
    template: "forgot-password",
    context: {
      key,
    },
  };
  await mailer
    .sendMail(data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = mail;
