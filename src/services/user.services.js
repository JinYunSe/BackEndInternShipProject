import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomError from '../class/customError.js';

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

    if (existUser) throw new CustomError('존재하는 아이디 입니다.', 400);

    password = await bcrypt.hash(password, 10);

    const signUpUser = await this.userRepository.signUp(userName, password, nickName);

    return {
      username: signUpUser.userName,
      nickname: signUpUser.nickName,
      authorities: signUpUser.authorities.map((authority) => ({
        authorityName: authority.authorityName,
      })),
    };
  };

  login = async (userName, password) => {
    const loginUser = await this.userRepository.findUserByUserName(userName);

    if (!loginUser) throw new CustomError('존재하지 않는 계정입니다.', 400);

    const check = await bcrypt.compare(password, loginUser.password);
    if (!check) throw new CustomError('아이디와 비밀번호를 확인해주세요.', 401);

    const token = jwt.sign({ userName: loginUser.userName }, process.env.JWT_SECRET || 'JWTSECRET');

    // 현재 과제에서는 jwt token을 사용할 곳이 없네요...

    // 현재 과제에서는 token을 Response Message로 제공 중이라 아래와 같이 반환했습니다.
    return {
      token,
    };
  };
}
