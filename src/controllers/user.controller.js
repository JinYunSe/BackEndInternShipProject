import joi from 'joi';

const signUpValidation = joi.object({
  username: joi
    .string()
    .pattern(/^[가-힣a-zA-Z0-9\s]+$/)
    .min(1)
    .max(191)
    .required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(1)
    .max(191)
    .required(),
  nickname: joi
    .string()
    .pattern(/^[가-힣a-zA-Z0-9\s]+$/)
    .min(1)
    .max(191)
    .required(),
});

const loginValidation = joi.object({
  username: joi
    .string()
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .min(1)
    .max(191)
    .required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(1)
    .max(191)
    .required(),
});

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // 회원 가입
  signUp = async (req, res, next) => {
    try {
      const validation = await signUpValidation.validateAsync(req.body);
      const { username: userName, password, nickname } = validation;

      const signUpUser = await this.userService.signUp(userName, password, nickname);

      return res.status(201).json(signUpUser);
    } catch (error) {
      // validation 오류일 경우 별도 오류 처리
      if (error instanceof joi.ValidationError)
        return res
          .status(400)
          .json('username 및 nickname은 한글, 소문자, 대문자, 공백만 가능합니다');

      // 다른 오류들 처리
      next(error);
    }
  };

  // 로그인
  login = async (req, res, next) => {
    try {
      const validation = await loginValidation.validateAsync(req.body);
      const { username: userName, password } = validation;

      const loginUser = await this.userService.login(userName, password);

      return res.status(200).json(loginUser);
    } catch (error) {
      // validation 오류일 경우 별도 오류 처리
      if (error instanceof joi.ValidationError)
        return res.status(400).json('username과 password를 확인해주세요');

      // 다른 오류들 처리
      next(error);
    }
  };
}
