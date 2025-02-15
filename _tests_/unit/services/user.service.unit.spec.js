import { expect, jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../../../src/services/user.services.js';
import CustomError from '../../../src/class/customError.js';

let mockUserRepository = {
  findUserByUserName: jest.fn(),
  signUp: jest.fn(),
};

let userService = new UserService(mockUserRepository);

describe('Users Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findUserByUserName Method', async () => {
    const mockUser = {
      userName: 'test1',
      nickName: 'test1',
      password: 'test1',
      authorities: [{ authorityName: 'ROLE_USER' }],
    };

    mockUserRepository.findUserByUserName.mockResolvedValue(mockUser);
    const result = await userService.findUserByUserName('test1');

    expect(mockUserRepository.findUserByUserName).toHaveBeenCalledWith('test1');
    expect(result).toEqual(mockUser);
  });

  test('signUp Method Success', async () => {
    mockUserRepository.findUserByUserName.mockResolvedValue(null);

    const mockUser = {
      userName: 'newUserName',
      nickName: 'newNickName',
      authorities: [{ authorityName: 'ROLE_USER' }],
    };

    mockUserRepository.signUp.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    const result = await userService.signUp('newUserName', 'newUserPassword', 'newNickName');

    expect(bcrypt.hash).toHaveBeenCalledWith('newUserPassword', 10);
    expect(mockUserRepository.signUp).toHaveBeenCalledWith(
      'newUserName',
      'hashedPassword',
      'newNickName',
    );
    expect(result).toEqual({
      username: 'newUserName',
      nickname: 'newNickName',
      authorities: [{ authorityName: 'ROLE_USER' }],
    });
  });

  test('signUp Method Failure (User Already Exists)', async () => {
    mockUserRepository.findUserByUserName.mockResolvedValue({ userName: 'test1' });

    await expect(userService.signUp('test1', 'test1', 'test1')).rejects.toThrow(
      new CustomError('존재하는 아이디 입니다.', 400),
    );

    expect(mockUserRepository.findUserByUserName).toHaveBeenCalledWith('test1');
  });

  test('login Method Success', async () => {
    const mockUser = {
      userName: 'test1',
      nickName: 'test1',
      password: 'hashedPassword',
      authorities: [{ authorityName: 'ROLE_USER' }],
    };

    mockUserRepository.findUserByUserName.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken');

    const result = await userService.login('test1', 'test1');

    expect(mockUserRepository.findUserByUserName).toHaveBeenCalledWith('test1');
    expect(bcrypt.compare).toHaveBeenCalledWith('test1', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userName: 'test1' },
      process.env.JWT_SECRET || 'JWTSECRET',
    );
    expect(result).toEqual({ token: 'mockedToken' });
  });

  test('login Method Failure (User Not Found)', async () => {
    mockUserRepository.findUserByUserName.mockResolvedValue(null);

    await expect(userService.login('nonExistentUser', 'nonExistentPassword')).rejects.toThrow(
      new CustomError('존재하지 않는 계정입니다.', 400),
    );

    expect(mockUserRepository.findUserByUserName).toHaveBeenCalledWith('nonExistentUser');
  });

  test('login Method Failure (Incorrect Password)', async () => {
    const mockUser = {
      userName: 'test1',
      nickName: 'test1',
      password: 'hashedPassword',
      authorities: [{ authorityName: 'ROLE_USER' }],
    };

    mockUserRepository.findUserByUserName.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(userService.login('test1', 'wrongPassword')).rejects.toThrow(
      new CustomError('아이디와 비밀번호를 확인해주세요.', 401),
    );

    expect(mockUserRepository.findUserByUserName).toHaveBeenCalledWith('test1');
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
  });
});
