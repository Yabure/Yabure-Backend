const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const EmailProviderInterface = require("./emailProvider.interface");

/**
 * SMTP Email Provider
 * Implementation of EmailProviderInterface for SMTP servers
 */
class SmtpProvider extends EmailProviderInterface {
  constructor() {
    super();
    this.mailer = null;
  }

  /**
   * Initialize the SMTP provider
   * @param {Object} config - Configuration with host, port, secure, auth
   */
  initialize(config) {
    this.mailer = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure || false,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
    
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
   * Send an email using SMTP
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
      throw new Error(`SMTP email error: ${err.message}`);
    }
  }
}

module.exports = SmtpProvider;
