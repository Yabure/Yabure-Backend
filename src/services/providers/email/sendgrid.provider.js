const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const hbs = require("nodemailer-express-handlebars");
const EmailProviderInterface = require("./emailProvider.interface");

/**
 * SendGrid Email Provider
 * Implementation of EmailProviderInterface for SendGrid
 */
class SendGridProvider extends EmailProviderInterface {
  constructor() {
    super();
    this.mailer = null;
  }

  /**
   * Initialize the SendGrid provider
   * @param {Object} config - Configuration object with api_key
   */
  initialize(config) {
    const options = {
      auth: {
        api_key: config.apiKey,
      },
    };

    this.mailer = nodemailer.createTransport(sgTransport(options));
    return this;
  }

  /**
   * Setup handlebars template engine
   * @param {Object} templateConfig - Configuration for template paths
   */
  setupTemplateEngine(templateConfig) {
    if (!this.mailer) {
      throw new Error("Provider must be initialized before setting up template engine");
    }

    this.mailer.use(
      "compile",
      hbs({
        viewEngine: {
          partialsDir: templateConfig.partialsDir,
          layoutsDir: templateConfig.layoutsDir,
          defaultLayout: templateConfig.defaultLayout || "",
        },
        viewPath: templateConfig.viewPath,
      })
    );
    
    return this;
  }

  /**
   * Send an email using SendGrid
   * @param {Object} emailData - Email data with to, from, subject, etc.
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async sendEmail(emailData) {
    if (!this.mailer) {
      throw new Error("Provider not initialized. Call initialize() first");
    }

    try {
      await this.mailer.sendMail(emailData);
      return true;
    } catch (err) {
      throw new Error(`SendGrid email error: ${err.message}`);
    }
  }
}

module.exports = SendGridProvider;
