import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  findUserByUserName = async (userName) => {
    const user = await this.userRepository.findUserByUserName(userName);
    return user;
  };

  signUp = async (userName, password, nickName) => {
    const existUser = await this.userRepository.findUserByUserName(userName);

    if (existUser) return '존재하는 아이디 입니다.';

    password = await bcrypt.hash(password, 10);

    const signUpUser = await this.userRepository.signUp(userName, password, nickName);

    return {
      username: signUpUser.userName,
      nickname: signUpUser.nickName,
      authorities: signUpUser.authorities.map((authority) => ({
        // authorities 배열 가공
        authorityName: authority.authorityName,
      })),
    };
  };

  login = async (userName, password) => {
    const loginUser = await this.userRepository.findUserByUserName(userName);

    if (!loginUser) return '존재하지 않는 계정입니다.';

    const check = await bcrypt.compare(password, loginUser.password);
    if (!check) return '아이디와 비밀번호를 확인해주세요';

    const token = jwt.sign({ userName: loginUser.userName }, process.env.JWT_SECRET);

    // 현재 과제에서는 jwt token을 사용할 곳이 없네요...

    // 현재 과제에서는 token을 Response Message로 제공 중이라 아래와 같이 반환했습니다.
    return {
      token,
    };
  };
}
