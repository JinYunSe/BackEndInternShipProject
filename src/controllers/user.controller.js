import joi from 'joi';
import CustomError from '../class/customError.js';

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
      const { username: userName, password, nickname: nickName } = validation;

      const signUpUser = await this.userService.signUp(userName, password, nickName);

      return res.status(201).json(signUpUser);
    } catch (error) {
      if (error instanceof joi.ValidationError) {
        const customError = new CustomError('입력 정보를 확인해주세요', 400);
        return next(customError);
      }
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
      if (error instanceof joi.ValidationError) {
        const customError = new CustomError('username과 password를 확인해주세요', 400);
        return next(customError);
      }
      next(error);
    }
  };
}
