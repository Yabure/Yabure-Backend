const HttpStatusCode = require("./http-response");

function formatResponse(params) {
  const { data, errors = false, message, success, subscribed } = params;
  return {
    data,
    errors,
    message,
    success,
    subscribed,
  };
}

class ResponseFormatter {
  static async SUCCESS(params) {
    const {
      message = "Request Successful",
      data = {},
      response,
      subscribed = true,
    } = params;
    const responseDetails = formatResponse({
      data,
      message,
      success: true,
      subscribed,
    });
    return response.status(HttpStatusCode.OK().value).send(responseDetails);
  }

  static async CREATED(params) {
    const {
      message = "Request Successful",
      data = {},
      response,
      subscribed = true,
    } = params;
    const responseDetails = formatResponse({
      message,
      success: true,
      subscribed,
    });
    return response
      .status(HttpStatusCode.CREATED().value)
      .send(responseDetails);
  }

  static async INVALID_REQUEST(params) {
    const {
      message = "Request failed",
      errors = true,
      response,
      subscribed = true,
    } = params;
    const responseDetails = formatResponse({
      errors,
      message,
      success: false,
      subscribed,
    });
    return response
      .status(HttpStatusCode.INVALID_REQUEST().value)
      .send(responseDetails);
  }

  static async UNAUTHORIZED(params) {
    const {
      message = "Request failed",
      errors = true,
      response,
      subscribed = true,
    } = params;
    const responseDetails = formatResponse({
      errors,
      message,
      success: false,
      subscribed,
    });
    return response
      .status(HttpStatusCode.UNAUTHORIZED().value)
      .send(responseDetails);
  }

  static async UNPROCCESSABLE_ENTITY(params) {
    const {
      message = "Request failed",
      errors = true,
      response,
      subscribed = true,
    } = params;
    const responseDetails = formatResponse({
      errors: true,
      message,
      success: false,
      subscribed,
    });
    return response
      .status(HttpStatusCode.UNPROCESSABLE_ENTITY().value)
      .send(responseDetails);
  }
}

module.exports = ResponseFormatter;
