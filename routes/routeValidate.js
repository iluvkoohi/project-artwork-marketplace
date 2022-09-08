const express = require("express");
const { isAuthenticated } = require("../middleware/authentication");
const router = express.Router();


router.get("/validate/http-request", isAuthenticated, (req, res) => {
    return res.status(200).json({ message: "Success" })
});


module.exports = router;
