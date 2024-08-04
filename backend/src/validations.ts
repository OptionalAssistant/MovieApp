import {body} from 'express-validator';

export const registerValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 8 символов').isLength({min : 8}),
    body('name','Имя должно быть минимум 2 символа').isLength({min : 2}),
];

export const loginValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({min : 8}),
];