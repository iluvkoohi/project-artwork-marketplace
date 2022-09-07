require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { throwError } = require("../../const/status");
const { validationResult } = require('express-validator');

const User = require("../../models/user");
const SALT_ROUNDS = 12;

const register = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return throwError(res, errors.array());

        const { email, password } = req.body;

        const doesExist = await User.findOne({ email });
        if (doesExist) return throwError(res, { message: "email is currently used" });

        await bcrypt.hash(password, SALT_ROUNDS)
            .then(async (hashValue) => {
                new User({ email, hashValue })
                    .save()
                    .then((value) => {
                        const token = jwt.sign(
                            { data: value._id.toString() },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "1h" }
                        );
                        return res.status(200).json({
                            accountId: value._id, email,
                            password: hashValue,
                            token
                        });
                    })
                    .catch((err) => throwError(res, err));
            });
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return throwError(res, errors.array());

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return throwError(res, { message: "email and/or password is incorrect" });

        await bcrypt.compare(password, user.hashValue, function (err, result) {
            if (err) return throwError(res, { message: "email and/or password is incorrect" });
            if (!result) return throwError(res, { message: "email and/or password is incorrect" });

            const token = jwt.sign(
                { data: user._id.toString() },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "2h" }
            );
            return res.status(200).json({
                "accountId": user._id,
                "email": user.email,
                "password": user.hashValue,
                "token": token
            });
        })

    } catch (error) {
        console.log(error);
    }
}

const changePassword = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return throwError(res, errors.array());

        const { email, password, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return throwError(res, { message: "email and/or password is incorrect" });

        await bcrypt.compare(password, user.hashValue, async function (err, result) {
            if (err) return throwError(res, { message: "email and/or password is incorrect" });
            if (!result) return throwError(res, { message: "email and/or password is incorrect" });

            const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
            const query = { email };
            const update = { hashValue: hash };
            const options = { new: true }
            return User.findOneAndUpdate(query, update, options)
                .then(value => res.status(200).json(value))
                .catch((err) => throwError(res, err));
        });


    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    register,
    login,
    changePassword
};


//const { sendEmail } = require("../services/nodemailer/mail");
// sendEmail(email,
//   "development.mail.ph@gmail.com",
//   "#AUTOMATED_NODEJS_MAIL #ByKOLYA",
//   "Account created",
//   "<b>Thank you for creating your account"
// );