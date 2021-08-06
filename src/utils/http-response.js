class HttpStatusCode {
    static OK() {
      return {
        value: 200,
        writable: false,
        enumerable: true,
        configurable: false,
      };
    }
  
    static CREATED() {
      return {
        value: 201,
        writable: false,
        enumerable: true,
        configurable: false,
      };
    }
  
    static UNPROCESSABLE_ENTITY() {
      return {
        value: 422,
        writable: false,
        enumerable: true,
        configurable: false,
      };
    }
  
    static INVALID_REQUEST() {
      return {
        value: 400,
        writable: false,
        enumerable: true,
        configurable: false,
      };
    }
}

module.exports = HttpStatusCode;