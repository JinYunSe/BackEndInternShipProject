import { expect, jest } from '@jest/globals';
import { UserController } from '../../../src/controllers/user.controller.js';
import CustomError from '../../../src/class/customError.js';

const mockUserService = {
  signUp: jest.fn(),
  login: jest.fn(),
};

const mockRequest = (body) => ({ body });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

const userController = new UserController(mockUserService);

describe('User Controller Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('signUp Method by Success', async () => {
    const req = mockRequest({
      username: 'testUser',
      password: 'testPass',
      nickname: 'testNick',
    });
    const res = mockResponse();
    const mockUser = { id: 1, username: 'testUser', nickname: 'testNick' };
    mockUserService.signUp.mockResolvedValue(mockUser);

    await userController.signUp(req, res, mockNext);

    expect(mockUserService.signUp).toHaveBeenCalledWith('testUser', 'testPass', 'testNick');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('signUp Method by Failure (Validation Error)', async () => {
    const req = mockRequest({ username: '', password: 'testPass', nickname: 'testNick' });
    const res = mockResponse();

    await userController.signUp(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });

  test('signUp Method by Failure (User Already Exists)', async () => {
    const req = mockRequest({
      username: 'existingUser',
      password: 'testPass',
      nickname: 'testNick',
    });
    const res = mockResponse();
    mockUserService.signUp.mockRejectedValue(new CustomError('User already exists', 409));

    await userController.signUp(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(409);
  });

  test('login Method by Success', async () => {
    const req = mockRequest({ username: 'testUser', password: 'testPass' });
    const res = mockResponse();
    const mockUser = { id: 1, username: 'testUser', token: 'jwt-token' };
    mockUserService.login.mockResolvedValue(mockUser);

    await userController.login(req, res, mockNext);

    expect(mockUserService.login).toHaveBeenCalledWith('testUser', 'testPass');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('login Method by Failure (Validation Error)', async () => {
    const req = mockRequest({ username: '', password: 'testPass123' });
    const res = mockResponse();

    await userController.login(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });

  test('login Method by Failure (User Not Found)', async () => {
    const req = mockRequest({ username: 'unknownUser', password: 'testPass' });
    const res = mockResponse();
    mockUserService.login.mockRejectedValue(new CustomError('User not found', 404));

    await userController.login(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
  });

  test('login Method by Failure (Incorrect Password)', async () => {
    const req = mockRequest({ username: 'testUser', password: 'wrongPass' });
    const res = mockResponse();
    mockUserService.login.mockRejectedValue(new CustomError('Incorrect password', 401));

    await userController.login(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
  });
});
