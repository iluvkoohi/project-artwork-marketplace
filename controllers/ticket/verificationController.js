require("dotenv").config();
const fs = require("fs");
const cloudinary = require("../../services/img-upload/cloundinary");
const Verification = require("../../models/ticket");
const { Profile } = require("../../models/profile");
const { throwError } = require("../../const/status");


// POST
const create = async (req, res) => {
    try {
        const accountId = req.user.data;
        const profile = req.profile;
        console.log(profile)
        const ticket = await Verification.findOne({ accountId });

        if (ticket) return throwError(res, { message: "cannot re-submit ticket" });

        req.body.accountId = accountId;
        req.body.profile = profile;
        return new Verification(req.body)
            .save()
            .then((value) => res.status(200).json(value))
            .catch((err) => throwError(res, err));
    } catch (error) {
        return throwError(res, error);
    }
}

// GET
const all = (req, res) => {
    try {
        const { status } = req.query;
        if (status == "pending") {
            return Verification.find({ status })
                .sort({ createdAt: -1 }) // filter by date
                .select({ __v: 0 }) // Do not return _id and __v
                .then((value) => res.status(200).json(value))
                .catch((err) => throwError(res, err));
        }
        return Verification.find({})
            .sort({ createdAt: -1 }) // filter by date
            .select({ __v: 0 }) // Do not return _id and __v
            .then((value) => res.status(200).json(value))
            .catch((err) => throwError(res, err));
    } catch (error) {
        console.error(error);
    }
};

const getByAccountId = (req, res) => {
    try {
        const accountId = req.params.id;
        return Verification.findOne({ accountId })
            .then((value) => {
                if (!value) return throwError(res, { message: "Tikcet not found" });
                return res.status(200).json(value);
            })
            .catch((err) => throwError(res, err));
    } catch (error) {
        console.error(error);
    }
};

// UPDATE
const updateProfileVerificationStatus = async (req, res) => {
    try {
        const { ticketId, accountId, ticketStatus, accountVerified } = req.body;

        const update = {
            $set: {
                "account.verified": accountVerified,
                "date.updatedAt": Date.now(),
            },
        };
        const options = { new: true, runValidators: true };

        const updateProfile = await Profile
            .findOneAndUpdate({ accountId }, update, options);

        const updateTicket = await Verification
            .findByIdAndUpdate(ticketId, { status: ticketStatus }, options);

        return res.status(200).json({ updateProfile, updateTicket });

    } catch (error) {
        return res.status(200).json(error);
    }
};

// DELETE
const deleteVerificationTicket = (req, res) => {
    try {
        const _id = req.params.id;
        Verification.findByIdAndDelete(_id)
            .then((value) => {
                if (value)
                    return res.status(200).json({ message: "deleted" });
                return res.status(200).json({ message: "_id doesn't exist or has already been deleted" });
            })
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    create,
    all,
    getByAccountId,
    updateProfileVerificationStatus,
    deleteVerificationTicket
};
