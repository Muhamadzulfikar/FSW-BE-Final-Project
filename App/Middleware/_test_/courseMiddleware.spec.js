const middleware = require('../courseMiddleware');

describe('filterByCategoriesAndLevel', () => {
  it('should set categoryIds and levels when valid query params are provided', () => {
    const req = { query: { categoryId: '1,2', level: 'beginner,intermediate' } };
    const res = {};
    const next = jest.fn();
    middleware.filterByCategoriesAndLevel(req, res, next);

    expect(req.categoryIds).toEqual([1, 2]);
    expect(req.levels).toEqual(['beginner', 'intermediate']);
    expect(next).toHaveBeenCalled();
  });

  it('should set categoryIds and levels to undefined when no query params are provided', () => {
    const req = { query: {} };
    const res = {};
    const next = jest.fn();
    middleware.filterByCategoriesAndLevel(req, res, next);

    expect(req.categoryIds).toBeUndefined();
    expect(req.levels).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should throw a bad request error when categoryId is not a string', () => {
    const req = { query: { categoryId: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const expectedError = new Error('Bad Request. params must be string');
    expectedError.code = 400;
    expectedError.status = 'Bad Request';

    middleware.filterByCategoriesAndLevel(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      status: 'Bad Request',
      message: 'Bad Request. params must be string',
    });
  });

  it('should throw a bad request error when level is not a string', () => {
    const req = { query: { level: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const expectedError = new Error('Bad Request. params must be string');
    expectedError.code = 400;
    expectedError.status = 'Bad Request';

    middleware.filterByCategoriesAndLevel(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      status: 'Bad Request',
      message: 'Bad Request. params must be string',
    });
  });

  it('should throw a bad request error when level is invalid', () => {
    const req = { query: { level: 'invalid' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const expectedError = new Error('Bad Request. level must be valid enum (beginner, intermediate, advanced)');
    expectedError.code = 400;
    expectedError.status = 'Bad Request';

    middleware.filterByCategoriesAndLevel(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      status: 'Bad Request',
      message: 'Bad Request. level must be valid enum (beginner, intermediate, advanced)',
    });
  });
});
