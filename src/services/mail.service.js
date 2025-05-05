const path = require("path");
const fs = require("fs");
const providerFactory = require("./providers/email/emailProviderFactory");
const SendGridProvider = require("./providers/email/sendgrid.provider");
const SmtpProvider = require("./providers/email/smtp.provider");
const MailgunProvider = require("./providers/email/mailgun.provider");
const MailtrapProvider = require("./providers/email/mailtrap.provider");

// Register available providers
providerFactory.registerProvider("sendgrid", SendGridProvider);
providerFactory.registerProvider("smtp", SmtpProvider);
providerFactory.registerProvider("mailgun", MailgunProvider);
providerFactory.registerProvider("mailtrap", MailtrapProvider);

/**
 * Mail Service using the Adapter Pattern
 * This service allows switching between different email providers
 */
class MailService {
  constructor() {
    this.provider = null;
    this.defaultProvider = "mailtrap"; // Default provider
  }

  /**
   * Initialize the mail service with a specific provider
   * @param {string} providerName - Name of the provider to use
   * @param {Object} config - Provider-specific configuration
   */
  initialize(providerName = this.defaultProvider, config = {}) {
    // Use provider from config or fall back to environment variables
    const providerConfig = config[providerName] || this._getDefaultConfig(providerName);
    
    // Get the provider from the factory
    this.provider = providerFactory.getProvider(providerName);
    
    // Initialize the provider with configuration
    this.provider.initialize(providerConfig);
    
    // Setup template engine with provider-specific configuration
    const templateConfig = this._getTemplateConfig(providerName);
    
    this.provider.setupTemplateEngine(templateConfig);
    
    return this;
  }

  /**
   * Get default configuration for providers based on environment variables
   * @param {string} providerName - Name of the provider
   * @returns {Object} - Provider configuration
   */
  _getDefaultConfig(providerName) {
    switch (providerName) {
      case "sendgrid":
        return {
          apiKey: process.env.SENDGRID_KEY
        };
      case "smtp":
        return {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        };
      case "mailgun":
        return {
          apiKey: process.env.MAIL_GUN_API_KEY,
          domain: process.env.MAIL_GUN_DOMAIN || "sandbox68855fcfb85444fe94ea604d77f90b53.mailgun.org",
          sender: process.env.MAIL_GUN_SENDER || "Yabure <postmaster@sandbox68855fcfb85444fe94ea604d77f90b53.mailgun.org>"
        };
      case "mailtrap":
        return {
          token: process.env.MAILTRAP_TOKEN,
          sender: {
            email: process.env.MAILTRAP_SENDER_EMAIL || "hello@demomailtrap.com",
            name: process.env.MAILTRAP_SENDER_NAME || "Yabure"
          }
        };
      default:
        throw new Error(`No default configuration for provider: ${providerName}`);
    }
  }

  /**
   * Get provider-specific template configuration
   * @param {string} providerName - The name of the provider
   * @returns {Object} - Template configuration
   */
  _getTemplateConfig(providerName) {
    const baseConfig = {
      partialsDir: path.join(__dirname, "../views/"),
      layoutsDir: path.join(__dirname, "../views/"),
      defaultLayout: "",
      viewPath: path.join(__dirname, "../views/"),
    };

    // Additional configuration for Mailgun
    if (providerName === "mailgun") {
      // Create a directory to cache compiled templates if it doesn't exist
      const cacheDir = path.join(__dirname, "../.template-cache");
      if (!fs.existsSync(cacheDir)) {
        try {
          fs.mkdirSync(cacheDir, { recursive: true });
        } catch (error) {
          console.warn(`Could not create template cache directory: ${error.message}`);
        }
      }

      return {
        ...baseConfig,
        cacheDir,
        // Add any Mailgun-specific template options here
        helpers: {
          // Example helper function that could be used in templates
          formatDate: (date) => {
            return new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long', 
              day: 'numeric'
            });
          }
        }
      };
    }

    return baseConfig;
  }

  /**
   * Send verification email
   * @param {Object} user - User object with email and profile
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async sendVerificationEmail(user, token) {
    this._ensureProviderInitialized();
    
    const emailData = {
      to: [`${user.email}`],
      from: `${process.env.MAILTRAP_SENDER_EMAIL}`,
      subject: "Verify Your Email",
      template: "token",
      context: {
        token,
        firstName: user.firstName,
      },
    };
    
    return this.provider.sendEmail(emailData);
  }

  /**
   * Send password reset OTP
   * @param {string} email - User email
   * @param {string} token - Reset token
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async sendPasswordResetOTP(email, token) {
    this._ensureProviderInitialized();
    
    const emailData = {
      to: [`${email}`],
      from: `${process.env.MAILTRAP_SENDER_EMAIL}`,
      subject: "Password Reset Code",
      template: "password-reset",
      context: {
        token
      },
    };
    
    return this.provider.sendEmail(emailData);
  }

  /**
   * Send moderator account creation email
   * @param {Object} user - User object with email, password, and name
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async modAccountCreatedEmail(user) {
    this._ensureProviderInitialized();
    
    const emailData = {
      to: [`${user.email}`],
      from: `${process.env.MAILTRAP_SENDER_EMAIL}`,
      subject: "Here Are Your Credentials",
      template: "mod-account",
      context: {
        password: user.password,
        email: user.email,
        firstName: user.name,
      },
    };
    
    return this.provider.sendEmail(emailData);
  }

  /**
   * Send forgot password email
   * @param {string} email - User email
   * @param {string} key - Reset key
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async sendForgotPasswordEmail(email, key) {
    this._ensureProviderInitialized();
    
    const emailData = {
      to: [`${email}`],
      from: `${process.env.MAILTRAP_SENDER_EMAIL}`,
      subject: "Password Reset",
      template: "forgot-password",
      context: {
        key,
      },
    };
    
    return this.provider.sendEmail(emailData);
  }

  /**
   * Ensure the provider is initialized before sending emails
   * @private
   */
  _ensureProviderInitialized() {
    if (!this.provider) {
      this.initialize();
    }
  }
}

// Create and export a singleton instance
const mailService = new MailService();
module.exports = mailService;
