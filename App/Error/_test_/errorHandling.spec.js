const errorHandling = require('../errorHandling');

describe('unauthorized', () => {
  it('should throw an error with status code 401', () => {
    const message = 'Unauthorized access';
    const expectedError = new Error(`Unauthorized. ${message}`);
    expectedError.code = 401;
    expectedError.status = 'Unauthorized';

    expect(() => errorHandling.unauthorized(message)).toThrow(expectedError);
  });
});

describe('forbidden', () => {
  it('should throw an error with status code 403', () => {
    const message = 'Access forbidden';
    const expectedError = new Error(`Forbidden. ${message}`);
    expectedError.code = 403;
    expectedError.status = 'Forbidden';

    expect(() => errorHandling.forbidden(message)).toThrow(expectedError);
  });
});

describe('internalError', () => {
  it('should throw an error with status code 500', () => {
    const message = 'Internal server error';
    const expectedError = new Error(`Internal Server Error. ${message}`);
    expectedError.code = 500;
    expectedError.status = 'Internal Server Error';

    expect(() => errorHandling.internalError(message)).toThrow(expectedError);
  });
});

describe('badRequest', () => {
  it('should throw an error with status code 400', () => {
    const message = 'Bad request';
    const expectedError = new Error(`Bad Request. ${message}`);
    expectedError.code = 400;
    expectedError.status = 'Bad Request';

    expect(() => errorHandling.badRequest(message)).toThrow(expectedError);
  });
});

describe('notModified', () => {
  it('should throw an error with status code 304', () => {
    const expectedError = new Error('Not Modified. Data Not Modified');
    expectedError.code = 304;
    expectedError.status = 'Not Modified';

    expect(() => errorHandling.notModified()).toThrow(expectedError);
  });
});
