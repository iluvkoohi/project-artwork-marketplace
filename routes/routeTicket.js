const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication");
const { isAuthorized, getProfile } = require("../middleware/authorization");

const ticket = require("../controllers/ticket/verificationController");

// VERIFICATION
router.post("/ticket/verification",
    isAuthenticated,
    getProfile,
    (req, res) => ticket.create(req, res));

router.get("/ticket/verification",
    isAuthenticated,
    (req, res) => ticket.all(req, res));

router.get("/ticket/verification/s/:id",
    isAuthenticated,
    (req, res) => ticket.getByAccountId(req, res));

router.put("/ticket/verification",
    isAuthenticated,
    (req, res) => ticket.updateProfileVerificationStatus(req, res));

router.delete("/ticket/verification/:id",
    isAuthenticated,
    (req, res) => ticket.deleteVerificationTicket(req, res));

module.exports = router;