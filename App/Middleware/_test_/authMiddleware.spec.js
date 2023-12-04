const middleware = require('../authMiddleware');
const authService = require('../../Services/authService');

const next = jest.fn();

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('isUserHasNotRegister', () => {
  const req = {
    body: {
      name: 'zulfikar',
      email: 'zulfikar@binar.com',
      password: 'zulfikar123',
      phone: '08123456789',
    },
  };

  const expectedError = new Error('Unauthorized. User Has Already Exists');
  expectedError.code = 401;
  expectedError.status = 'Unauthorized';

  it('should call next when user is not registered', async () => {
    authService.findUser = jest.fn().mockResolvedValue(null);
    await middleware.isUserHasNotRegister(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error when user is already registered', async () => {
    authService.findUser = jest.fn().mockResolvedValue(req.body);
    await middleware.isUserHasNotRegister(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. User Has Already Exists',
    });
  });
});

describe('isUserHasRegister', () => {
  const req = {
    body: {
      name: 'zulfikar',
      email: 'zulfikar@binar.com',
      password: 'zulfikar123',
      phone: '08123456789',
    },
  };

  const expectedError = new Error('Unauthorized. Cannot Find User');
  expectedError.code = 401;
  expectedError.status = 'Unauthorized';

  it('should call next when user is registered', async () => {
    authService.findUser = jest.fn().mockResolvedValue(req.body);
    await middleware.isUserHasRegister(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error when user is not registered', async () => {
    authService.findUser = jest.fn().mockResolvedValue(null);
    await middleware.isUserHasRegister(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. Cannot Find User',
    });
  });
});

describe('validateBodyRequest', () => {
  const expectedError = new Error('Unauthorized. Name must not be empty');
  expectedError.code = 401;
  expectedError.status = 'Unauthorized';

  it('should call next when body request is valid', () => {
    const req = {
      body: {
        name: 'zulfikar',
        email: 'zulfikar@binar.com',
        password: 'zulfikar123',
        phone: '08123456789',
      },
    };

    middleware.validateBodyRequest(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error when name request is null', () => {
    const req = {
      body: {
        email: 'zulfikar@binar.com',
        password: 'zulfikar123',
        phone: '08123456789',
      },
    };

    middleware.validateBodyRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. Name must not be empty',
    });
  });

  it('should throw an error when email request is null', () => {
    const req = {
      body: {
        name: 'zulfikar',
        password: 'zulfikar123',
        phone: '08123456789',
      },
    };

    middleware.validateBodyRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. Email must not be empty',
    });
  });

  it('should throw an error when password request is null', () => {
    const req = {
      body: {
        name: 'zulfikar',
        email: 'zulfikar@binar.com',
        phone: '08123456789',
      },
    };

    middleware.validateBodyRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. Password must not be empty',
    });
  });

  it('should throw an error when phone number request is null', () => {
    const req = {
      body: {
        name: 'zulfikar',
        email: 'zulfikar@binar.com',
        password: 'zulfikar123',
      },
    };

    middleware.validateBodyRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. Phone number must not be empty',
    });
  });
});

describe('validateBodyLogin', () => {
  const expectedError = new Error('Unauthorized. Email must not be empty');
  expectedError.code = 401;
  expectedError.status = 'Unauthorized';

  it('should call next when body request is valid', () => {
    const req = {
      body: {
        email: 'zulfikar@binar.com',
        password: 'zulfikar123',
      },
    };

    middleware.validateBodyLogin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error when email request is null', () => {
    const req = {
      body: {
        password: 'zulfikar123',
      },
    };

    middleware.validateBodyLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. Email must not be empty',
    });
  });

  it('should throw an error when password request is null', () => {
    const req = {
      body: {
        email: 'zulfikar@binar.com',
      },
    };

    middleware.validateBodyLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. Password must not be empty',
    });
  });
});

describe('authorize', () => {
  const req = {
    headers: {
      authorization: 'Bearer 1234567890',
    },
  };

  it('should call next when user is authorized', async () => {
    const expectedUser = {
      name: 'zulfikar',
      email: 'zulfikar@binar.com',
      password: 'zulfikar123',
      phone: '08123456789',
    };

    authService.authorize = jest.fn().mockResolvedValue(expectedUser);
    await middleware.authorize(req, res, next);
    req.user = expectedUser;
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(expectedUser);
  });

  it('should throw an error when user is not authorized', async () => {
    const expectedError = new Error('Unauthorized. User Not Found');
    expectedError.code = 401;
    expectedError.status = 'Unauthorized';

    authService.authorize = jest.fn().mockResolvedValue(null);
    await middleware.authorize(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 401,
      status: 'Unauthorized',
      message: 'Unauthorized. User Not Found',
    });
  });
});

describe('isSuperAdmin', () => {
  it('should call next when user is super admin', async () => {
    const req = {
      user: {
        role: 'superadmin',
      },
    };
    await middleware.isSuperAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error when user is not super admin', async () => {
    const req = {
      user: {
        role: 'admin',
        name: 'Zulfikar',
      },
    };
    const expectedError = new Error(`Forbidden. ${req.user.name} Is Not Super Admin`);
    expectedError.code = 403;
    expectedError.status = 'Forbidden';

    await middleware.isSuperAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      code: 403,
      status: 'Forbidden',
      message: 'Forbidden. Zulfikar Is Not Super Admin',
    });
  });
});

describe('isSuperAdminAndAdmin', () => {
  it('should call next when user is super admin', async () => {
    const req = {
      user: {
        role: 'superadmin',
      },
    };

    await middleware.isSuperAdminAndAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next when user is admin', async () => {
    const req = {
      user: {
        role: 'admin',
      },
    };

    await middleware.isSuperAdminAndAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error when user is not super admin and admin', async () => {
    const req = {
      user: {
        role: 'user',
        name: 'Zulfikar',
      },
    };
    const expectedError = new Error(`Forbidden. ${req.user.name} Is Not Super Admin`);
    expectedError.code = 403;
    expectedError.status = 'Forbidden';

    await middleware.isSuperAdminAndAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      code: 403,
      status: 'Forbidden',
      message: 'Forbidden. Zulfikar Is Not Super Admin',
    });
  });
});
