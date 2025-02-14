export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  findUserByUserName = async (userName) => {
    const user = await this.userRepository.findUserByUserName(userName);
    return user.username;
  };

  signUp = async (userName, password, nickname) => {
    if (!userName || !password || !nickname) return '올바르지 않은 입력 입니다.';

    const existUser = await this.userRepository.findUserByUserName(userName);

    if (existUser) return '존재하는 아이디 입니다.';

    const signUpUser = await this.userRepository.signUp(userName, password, nickname);

    return {
      username: signUpUser.userName,
      nickname: signUpUser.nickname,
      authorities: {
        authorityName: signUpUser.authorityName,
      },
    };
  };

  login = async (userName, password) => {
    if (!userName || !password) return '올바르지 않은 입력 입니다.';

    const loginUser = await this.userRepository.login(userName, password);

    if (!loginUser) return '존재하지 않는 계정입니다.';

    return {
      token: loginUser.password,
    };
  };
}
