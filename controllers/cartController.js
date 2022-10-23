const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication");
const Cart = require("../models/cart");
const Art = require("../models/art");

router.post("/cart", isAuthenticated, async (req, res) => {
    const _id = req.body.id;
    const art = await Art.findById(_id);

    if (!art) return res
        .status(400)
        .json({ message: "Art not found" });

    req.body.accountId = req.user.data;
    req.body.art = art;
    return new Cart(req.body)
        .save()
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
})

router.get("/cart", isAuthenticated, async (req, res) => {
    return Cart.find({ accountId: req.user.data })
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
})


router.delete("/cart/:_id", isAuthenticated, async (req, res) => {
    return Cart.findByIdAndDelete(req.params._id)
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
})



module.exports = router;