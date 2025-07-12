const baseResponse = (
  h,
  {
    statusCode = 200,
    status = 'success',
    message = null,
    data = null,
  },
) => {
  const responseObj = { status };

  if (message) {
    responseObj.message = message;
  }

  if (data) {
    responseObj.data = data;
  }

  const response = h
    .response(responseObj)
    .code(statusCode);

  return response;
};

const failed = (h, { statusCode, message }) => {
  if (statusCode < 400 || statusCode > 499) {
    throw new Error('Invalid failed status code (must be between 400 - 499)');
  }

  return baseResponse(h, { status: 'fail', statusCode, message });
};

const systemFailed = (h, { statusCode, message }) => {
  if (statusCode < 500 || statusCode > 599) {
    throw new Error('Invalid system failed status code (must be between 500 - 599)');
  }

  return baseResponse(h, { status: 'fail', statusCode, message });
};

const succeed = (h, { message = null, data = null }) => baseResponse(
  h,
  { message, data },
);

const created = (h, { message = null, data = null }) => baseResponse(
  h,
  { statusCode: 201, message, data },
);

module.exports = { succeed, created, failed };
