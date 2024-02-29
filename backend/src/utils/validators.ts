import { body, ValidationChain, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({ errors: errors.array() });
  };
};

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should have atleast 6 characters"),
];

export const signupValidator = [
  body("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Name is required & should have atleast 3 characters"),
  ...loginValidator,
];

export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message is required"),
  ...loginValidator,
];