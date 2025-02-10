import { body } from "express-validator";
import { validateErrors, validateErrorsWithoutFile } from "./validated.errors.js";
import { existCourse, existEmail, existUsername } from "../utils/db.validator.js";

export const courseValidator=[
    body('name','Name cannot be empty').notEmpty().toLowerCase().custom(existCourse),
    body('hour','Hour cannot be empty').notEmpty(),
    validateErrors
]

export const UserValidator=[
    body('name','Name cannot be empty').notEmpty(),
    body('surname','Surname cannot be empty').notEmpty(),
    body('email','Email cannot be empty').notEmpty().isEmail().custom(existEmail),
    body('username','Username cannot be empty').notEmpty().toLowerCase().custom(existUsername),
    body('password','Password cannot be empty').notEmpty().isStrongPassword().withMessage('Password must be strong').isLength({min:8}),
]