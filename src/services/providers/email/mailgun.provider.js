const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const hbs = require("nodemailer-express-handlebars");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const EmailProviderInterface = require("./emailProvider.interface");

/**
 * Mailgun Email Provider
 * Implementation of EmailProviderInterface for Mailgun
 */
class MailgunProvider extends EmailProviderInterface {
  constructor() {
    super();
    this.client = null;
    this.domain = null;
    this.sender = null;
    this.templateEngine = null;
    this.templateConfig = null;
    this.compiledTemplates = new Map();
  }

  /**
   * Initialize the Mailgun provider
   * @param {Object} config - Configuration with apiKey, domain, and sender
   */
  initialize(config) {
    const mailgun = new Mailgun(FormData);
    
    this.client = mailgun.client({
      username: "api",
      key: config.apiKey,
      // url: config.endpoint || "https://api.mailgun.net" // Default to US endpoint
    });
    
    this.domain = config.domain || "sandbox68855fcfb85444fe94ea604d77f90b53.mailgun.org";
    this.sender = config.sender || `Yabure <postmaster@${this.domain}>`;
    
    return this;
  }

  /**
   * Setup handlebars template engine
   * @param {Object} templateConfig - Configuration for template paths
   */
  setupTemplateEngine(templateConfig) {
    // Store template configuration for later use
    this.templateConfig = templateConfig;
    
    // Register helpers if provided
    if (templateConfig.helpers) {
      Object.entries(templateConfig.helpers).forEach(([name, fn]) => {
        handlebars.registerHelper(name, fn);
      });
    }
    
    // Register partials if they exist
    try {
      const partialsDir = templateConfig.partialsDir;
      const partialFiles = fs.readdirSync(partialsDir);
      
      partialFiles.forEach(file => {
        if (file.endsWith('.hbs')) {
          const partialName = file.replace('.hbs', '');
          const partialContent = fs.readFileSync(`${partialsDir}/${file}`, 'utf8');
          handlebars.registerPartial(partialName, partialContent);
        }
      });
    } catch (error) {
      console.warn('Error registering partials:', error.message);
    }
    
    // Pre-compile and cache all templates if a cache directory is specified
    if (templateConfig.cacheDir) {
      try {
        const viewPath = templateConfig.viewPath;
        const templateFiles = fs.readdirSync(viewPath);
        
        templateFiles.forEach(file => {
          if (file.endsWith('.hbs')) {
            const templateName = file.replace('.hbs', '');
            const templatePath = path.join(viewPath, file);
            const templateSource = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(templateSource);
            
            this.compiledTemplates.set(templateName, compiledTemplate);
          }
        });
        
        console.log(`Pre-compiled ${this.compiledTemplates.size} templates for Mailgun provider`);
      } catch (error) {
        console.warn('Error pre-compiling templates:', error.message);
      }
    }
    
    return this;
  }

  /**
   * Send an email using Mailgun
   * @param {Object} emailData - Email data with to, from, subject, template, context, etc.
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async sendEmail(emailData) {
    if (!this.client) {
      throw new Error("Provider not initialized. Call initialize() first");
    }

    try {
      // If a template is specified, use Handlebars to render it
      let text = emailData.text;
      let html = emailData.html;
      
      if (emailData.template && this.templateConfig) {
        const templateName = emailData.template;
        let template;
        
        // Try to use cached compiled template first
        if (this.compiledTemplates.has(templateName)) {
          template = this.compiledTemplates.get(templateName);
          html = template(emailData.context || {});
        } else {
          // Otherwise compile it on the fly
          const templatePath = `${this.templateConfig.viewPath}/${templateName}.handlebars`;

          if (fs.existsSync(templatePath)) {
            const templateSource = fs.readFileSync(templatePath, 'utf8');
            template = handlebars.compile(templateSource);
            html = template(emailData.context || {});
            
            // Cache the compiled template for future use
            this.compiledTemplates.set(templateName, template);
          } else {
            throw new Error(`Template not found: ${templateName}`);
          }
        }
        
        // Create a simple text version by stripping HTML tags
        text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      
      // Prepare the message data
      const messageData = {
        from: emailData.from || this.sender,
        to: Array.isArray(emailData.to) ? emailData.to.join(',') : [emailData.to].join(','),
        subject: emailData.subject,
        text: text,
        html: html
      };
      
      // Send the email
      const data = await this.client.messages.create(this.domain, messageData);
      console.log("Mailgun email sent:", data);
      return true;
    } catch (err) {
      console.error("Mailgun email error:", err);
      throw new Error(`Mailgun email error: ${err.message}`);
    }
  }
}

module.exports = MailgunProvider;
