/**
 * Email Provider Interface
 * This interface defines the contract that all email provider implementations must follow.
 */
class EmailProviderInterface {
  /**
   * Initialize the email provider with configuration
   * @param {Object} config - Provider-specific configuration
   */
  initialize(config) {
    throw new Error('Method initialize() must be implemented by concrete providers');
  }

  /**
   * Send an email
   * @param {Object} emailData - The email data containing to, from, subject, etc.
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async sendEmail(emailData) {
    throw new Error('Method sendEmail() must be implemented by concrete providers');
  }

  /**
   * Set up template engine
   * @param {Object} templateConfig - Configuration for template engine
   */
  setupTemplateEngine(templateConfig) {
    throw new Error('Method setupTemplateEngine() must be implemented by concrete providers');
  }
}

module.exports = EmailProviderInterface;
