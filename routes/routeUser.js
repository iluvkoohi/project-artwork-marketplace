const express = require("express");
const router = express.Router();
const { check } = require('express-validator');

const user = require("../controllers/user/userController");

router.post("/user/register",
    [
        check('email').isEmail().withMessage('Email is invalid'),
        check('password', 'Password is required')
            .notEmpty()
            .isLength({ min: 10, max: 25 })
            .withMessage("Password must have at least 10 characters and maximum of 25")
            .not()
            .matches(/^[A-Za-z0-9 .,'!&]+$/)
            .withMessage("Password must have at least 1 special character"),
    ], (req, res) => user.register(req, res));

router.post("/user/login",
    [
        check('email').isEmail().withMessage('Email is invalid'),
        check('password', 'Password is required').notEmpty()
    ], (req, res) => user.login(req, res));

router.put("/user/change-password",
    [
        check('email').isEmail().withMessage('Email is invalid'),
        check('password', 'Password is required').notEmpty(),
        check('newPassword', 'New Password is required')
            .notEmpty()
            .isLength({ min: 10, max: 25 })
            .withMessage("Password must have at least 10 characters and maximum of 25")
            .not()
            .matches(/^[A-Za-z0-9 .,'!&]+$/)
            .withMessage("Password must have at least 1 special character")
    ], (req, res) => user.changePassword(req, res));

router.post("/replace/http-only", (req, res) => {
    return res
        .status(200)
        .cookie('token', "token_replaced", { httpOnly: true, maxAge: 0.001, sameSite: "none", secure: true })
        .json({ message: "Success" })
});

module.exports = router;
