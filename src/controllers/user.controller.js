export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // 회원 가입
  signUp = async (req, res, next) => {
    try {
      const { username, password, nickname } = req.body;

      const signUpUser = await this.userService.signUp(username, password, nickname);

      return res.status(201).json(signUpUser);
    } catch (error) {
      next(error);
    }
  };

  // 로그인
  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const loginUser = await this.userService.login(username, password);

      return res.status(200).json(loginUser);
    } catch (error) {
      next(error);
    }
  };
}
