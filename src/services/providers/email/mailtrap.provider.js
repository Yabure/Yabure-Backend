const { MailtrapClient } = require("mailtrap");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const EmailProviderInterface = require("./emailProvider.interface");

/**
 * Mailtrap Email Provider
 * Implementation of EmailProviderInterface for Mailtrap
 */
class MailtrapProvider extends EmailProviderInterface {
  constructor() {
    super();
    this.client = null;
    this.sender = null;
    this.templateConfig = null;
    this.compiledTemplates = new Map();
  }

  /**
   * Initialize the Mailtrap provider
   * @param {Object} config - Configuration with token and sender
   */
  initialize(config) {
    if (!config.token) {
      throw new Error("Mailtrap token is required");
    }
    
    this.client = new MailtrapClient({
      token: config.token,
    });
    
    this.sender = config.sender || {
      email: "hello@demomailtrap.com",
      name: "Yabure",
    };
    
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
        if (file.endsWith('.hbs') || file.endsWith('.handlebars')) {
          const partialName = file.replace(/\.(hbs|handlebars)$/, '');
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
          if (file.endsWith('.hbs') || file.endsWith('.handlebars')) {
            const templateName = file.replace(/\.(hbs|handlebars)$/, '');
            const templatePath = path.join(viewPath, file);
            const templateSource = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(templateSource);
            
            this.compiledTemplates.set(templateName, compiledTemplate);
          }
        });
        
        console.log(`Pre-compiled ${this.compiledTemplates.size} templates for Mailtrap provider`);
      } catch (error) {
        console.warn('Error pre-compiling templates:', error.message);
      }
    }
    
    return this;
  }

  /**
   * Send an email using Mailtrap
   * @param {Object} emailData - Email data with to, from, subject, template, context, etc.
   * @returns {Promise<boolean>} - Returns true if successful
   */
  async sendEmail(emailData) {
    if (!this.client) {
      throw new Error("Provider not initialized. Call initialize() first");
    }

    try {
      // If a template is specified, use Handlebars to render it
      let text = emailData.text || "";
      let html = emailData.html || "";
      
      if (emailData.template && this.templateConfig) {
        const templateName = emailData.template;
        let template;
        
        // Try to use cached compiled template first
        if (this.compiledTemplates.has(templateName)) {
          template = this.compiledTemplates.get(templateName);
          html = template(emailData.context || {});
        } else {
          // Try different extensions
          const extensions = ['.handlebars', '.hbs'];
          let templatePath = null;
          let found = false;
          
          for (const ext of extensions) {
            const testPath = `${this.templateConfig.viewPath}/${templateName}${ext}`;
            if (fs.existsSync(testPath)) {
              templatePath = testPath;
              found = true;
              break;
            }
          }
          
          if (found) {
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
      
      // Format recipients for Mailtrap client
      const recipients = Array.isArray(emailData.to) 
        ? emailData.to.map(email => ({ email: typeof email === 'string' ? email : email.email }))
        : [{ email: emailData.to }];
      
      // Prepare message for Mailtrap
      const messageData = {
        from: emailData.from 
          ? (typeof emailData.from === 'string' 
              ? { email: emailData.from, name: emailData.from.split('@')[0] } 
              : emailData.from)
          : this.sender,
        to: recipients,
        subject: emailData.subject,
        text: text,
        html: html,
        category: "Yabure",
      };
      
      // Send the email
      const result = await this.client.send(messageData);
      console.log("Mailtrap email sent:", result);
      return true;
    } catch (err) {
      console.error("Mailtrap error:", err);
      throw new Error(`Mailtrap email error: ${err.message}`);
    }
  }
}

module.exports = MailtrapProvider;
