const HttpStatusCode = require('./http-response');


function formatResponse(params) {
  const { data, errors = false, message, success } = params;
  return {
    data,
    errors,
    message,
    success
  };
}

class ResponseFormatter {
  static SUCCESS(params) {
    const { message= "Request Successful", data= {}, response } = params;
    const responseDetails = formatResponse({ data, message, success: true });
    return response.status(HttpStatusCode.OK().value).send(responseDetails);
  }

  static CREATED(params) {
    const { message = 'Request Successful', data = {}, response } = params;
    const responseDetails = formatResponse({ message, success: true });
    return response.status(HttpStatusCode.CREATED().value).send(responseDetails);
  }

  static INVALID_REQUEST(params) {
    const { message = 'Request failed', errors = true, response } = params;
    const responseDetails = formatResponse({ errors, message, success: false });
    return response.status(HttpStatusCode.INVALID_REQUEST().value).send(responseDetails);
  }

  static UNPROCCESSABLE_ENTITY(params) {
    const { message = 'Request failed', errors = true, response } = params;
    const responseDetails = formatResponse({ errors: true, message, success: false });
    return response.status(HttpStatusCode.UNPROCESSABLE_ENTITY().value).send(responseDetails);
  }
}

module.exports = ResponseFormatter;