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

  signUp = async (userName, password, nickname) => {
    const signUpUser = await this.prisma.user.create({
      data: {
        userName,
        password,
        nickname,
      },
    });

    return signUpUser;
  };

  login = async (userName, password) => {
    const user = await this.prisma.user.findUnique({
      where: { userName, password },
    });

    return user;
  };
}
