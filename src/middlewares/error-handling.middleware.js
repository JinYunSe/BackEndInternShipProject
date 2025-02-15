import CustomError from '../class/customError.js';

export default function (err, req, res, next) {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errorMessage: err.message });
  } else {
    res.status(500).json({ errorMessage: '서버 내부 에러가 발생했습니다.' });
  }
}
