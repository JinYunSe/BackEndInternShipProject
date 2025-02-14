export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  findUserByUserName = async (userName) => {
    const user = await this.userRepository.findUserByUserName(userName);
    return user.username;
  };

  signUp = async (userName, password, nickname) => {
    const existUser = await this.userRepository.findUserByUserName(userName);

    if (existUser) return '존재하는 아이디 입니다.';

    const signUpUser = await this.userRepository.signUp(userName, password, nickname);

    return {
      username: signUpUser.userName,
      nickname: signUpUser.nickname,
      authorities: signUpUser.authorities.map((authority) => ({
        // authorities 배열 가공
        authorityName: authority.authorityName,
      })),
    };
  };

  login = async (userName, password) => {
    const loginUser = await this.userRepository.login(userName, password);

    if (!loginUser) return '존재하지 않는 계정입니다.';

    return {
      token: loginUser.password,
    };
  };
}
