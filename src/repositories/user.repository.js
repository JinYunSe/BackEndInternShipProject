export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findUserByUserName = async (userName) => {
    const user = await this.prisma.user.findUnique({
      where: { userName },
    });
    return user;
  };

  signUp = async (userName, password, nickName) => {
    const signUpUser = await this.prisma.user.create({
      data: {
        userName,
        password,
        nickName,
        authorities: {
          create: [{ authorityName: 'ROLE_USER' }],
        },
      },
      include: {
        authorities: true,
      },
    });

    console.log('객체 정보 확인', signUpUser);

    return signUpUser;
  };

  login = async (userName, password) => {
    const user = await this.prisma.user.findUnique({
      where: { userName, password },
    });

    return user;
  };
}
