const express = require("express");
const router = express.Router();
const Billing = require("../models/billing");

router.put("/art/status", (req, res) => {
    const { _id, status } = req.body;
    return Billing.findByIdAndUpdate(_id, { status }, { new: true })
        .then((value) => {
            if (!value) return res.status(400).json({ message: "Update failed" });
            return res.status(200).json(value);
        })
        .catch((err) => res.status(400).json(err));
})
module.exports = router;