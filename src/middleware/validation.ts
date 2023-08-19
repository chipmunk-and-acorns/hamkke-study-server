import { NextFunction, Request, Response } from 'express';
import { check, validationResult, ValidationError, FieldValidationError } from 'express-validator';

export const memberValid = {
  register: [
    check('username').isEmail().withMessage('유효한 이메일 주소를 입력해주세요.'),
    check('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+[\]{}|;:'",.<>/?])$/)
      .withMessage(
        '비밀번호는 최소 1개의 소문자, 대문자, 숫자, 특수문자(!@#$%^&*()_+)를 포함해야 합니다.',
      )
      .isLength({
        min: 8,
        max: 16,
      })
      .withMessage('비밀번호는 최소 8글자부터 최대 16글자까지 가능합니다.'),
    check('nickname')
      .isLength({ min: 2, max: 10 })
      .withMessage('닉네임은 최소 2글자부터 최대 10글자까지 가능합니다.'),
    (request: Request, response: Response, next: NextFunction) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        const result = errors
          .array()
          .reduce((acc: { [key: string]: string }, cur: ValidationError) => {
            const error = cur as FieldValidationError;
            const { path, msg } = error;

            if (path in acc) {
              acc[path] = acc[path] += `\n${msg}`;
            } else {
              acc[path] = msg;
            }

            return acc;
          }, {});

        return response.status(400).json({ errors: result });
      }

      next();
    },
  ],
  login: [
    check('username').isEmail().withMessage('유효한 이메일 주소를 입력해주세요.'),
    check('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+[\]{}|;:'",.<>/?])$/)
      .withMessage(
        '비밀번호는 최소 1개의 소문자, 대문자, 숫자, 특수문자(!@#$%^&*()_+)를 포함해야 합니다.',
      )
      .isLength({
        min: 8,
        max: 16,
      })
      .withMessage('비밀번호는 최소 8글자부터 최대 16글자까지 가능합니다.'),
    (request: Request, response: Response, next: NextFunction) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        const result = errors
          .array()
          .reduce((acc: { [key: string]: string }, cur: ValidationError) => {
            const error = cur as FieldValidationError;
            const { path, msg } = error;

            if (path in acc) {
              acc[path] = acc[path] += `\n${msg}`;
            } else {
              acc[path] = msg;
            }

            return acc;
          }, {});

        return response.status(400).json({ errors: result });
      }

      next();
    },
  ],
};
