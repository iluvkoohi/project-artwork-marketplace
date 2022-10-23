const { Profile } = require("../models/profile");

const isAuthorized = async (req, res, next) => {
    const accountId = req.user.data;
    Profile.findOne({ accountId })
        .select({ accountId: 0, __v: 0, _id: 0, gallery: 0 })
        .then((value) => {

            if (!value) return res
                .status(403)
                .json({ message: "Account profile not found" });

            if (value) {
                if (!value.account.verified) return res
                    .status(403)
                    .json({ message: "Account is not authorized to perfom this action" });
                req.profile = value;
                next();
            }

        })
        .catch((err) => {
            console.log(err)
        });
};

const getProfile = async (req, res, next) => {
    const accountId = req.user.data;
    Profile.findOne({ accountId })
        .select({ accountId: 0, __v: 0, _id: 0, gallery: 0 })
        .then((value) => {
            if (!value) return res
                .status(403)
                .json({ message: "Account profile not found" });
            req.profile = value;
            next();
        })
        .catch((err) => console.log(err));
};

module.exports = { isAuthorized, getProfile };