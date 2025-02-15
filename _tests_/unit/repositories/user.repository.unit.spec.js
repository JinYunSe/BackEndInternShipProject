import { expect, jest } from '@jest/globals';
import { UserRepository } from '../../../src/repositories/user.repository.js';

let mockUserPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

let userRepository = new UserRepository(mockUserPrisma);

describe('User Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findUserByUserName Method', async () => {
    const mockUser = {
      id: 1,
      userName: 'test1',
      nickName: 'test1',
      password: '$2b$10$vev1MGJuQDxb49r6cj/Ho.ay0.07ACzVQkgnJKyigZg8LAKiYS48W',
    };

    mockUserPrisma.user.findUnique.mockResolvedValue(mockUser);

    const user = await userRepository.findUserByUserName('test1');

    expect(mockUserPrisma.user.findUnique).toHaveBeenCalledTimes(1);

    expect(mockUserPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { userName: 'test1' },
    });
    expect(user).toEqual(mockUser);
  });

  test('singUp Method', async () => {
    const newUser = {
      userName: 'newUser',
      password: 'newPassword',
      nickname: 'newNick',
    };

    const createdUser = {
      id: 99999999,
      ...newUser,
      authorities: [{ authorities: 'ROLE_USER' }],
    };

    mockUserPrisma.user.create.mockResolvedValue(createdUser);

    const result = await userRepository.signUp(
      newUser.userName,
      newUser.password,
      newUser.nickName,
    );

    expect(mockUserPrisma.user.create).toHaveBeenCalledTimes(1);

    expect(mockUserPrisma.user.create).toHaveBeenCalledWith({
      data: {
        userName: newUser.userName,
        password: newUser.password,
        nickName: newUser.nickName,
        authorities: {
          create: [{ authorityName: 'ROLE_USER' }],
        },
      },
      include: {
        authorities: true,
      },
    });
    expect(result).toEqual(createdUser);
  });
});
