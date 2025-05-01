/**
 * Email Provider Factory
 * Factory class for creating and managing email providers
 */
class EmailProviderFactory {
  constructor() {
    this.providers = {};
  }

  /**
   * Register a provider with a name
   * @param {string} name - The name to register the provider under
   * @param {class} ProviderClass - The provider class
   */
  registerProvider(name, ProviderClass) {
    this.providers[name] = ProviderClass;
  }

  /**
   * Get a provider instance by name
   * @param {string} name - The name of the provider to get
   * @returns {Object} - A new instance of the requested provider
   */
  getProvider(name) {
    const Provider = this.providers[name];
    if (!Provider) {
      throw new Error(`Provider "${name}" is not registered`);
    }
    return new Provider();
  }
}

module.exports = new EmailProviderFactory();
