const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication");
const { isAuthorized } = require("../middleware/authorization");

const { check } = require('express-validator');

const art = require("../controllers/art/artController");

const purchase = require("../controllers/art/artPurchaseController");

const artValidator = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    // check('address', 'Address is required').notEmpty(),
    // check('latitude', 'Latitude is required').notEmpty(),
    // check('longitude', 'Longitude is required').notEmpty(),
];

const updateArtImagesValidator = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
];

const updateArtValidator = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('availability', 'Availability is required').notEmpty(),
];
const VALIDATOR_PURCHASE = [
    check('artistAccountId', 'Artist accountId is required').notEmpty(),
    check('_artId', 'Art Id is required').notEmpty(),
];

router.post("/art",
    isAuthenticated,
    isAuthorized,
    artValidator,
    (req, res) => art.create(req, res));

router.get("/arts",
    isAuthenticated,
    isAuthorized,
    (req, res) => art.getAllArts(req, res));

router.get("/arts/by-artists",
    isAuthenticated,
    (req, res) => art.getAllArtsByArtist(req, res));

router.get("/arts/by-category",
    isAuthenticated,
    (req, res) => art.getAllArtsByCategory(req, res));

router.get("/art/s/:id",
    isAuthenticated,
    isAuthorized,
    (req, res) => art.getById(req, res));

router.put("/art/update",
    isAuthenticated,
    isAuthorized, updateArtValidator,
    (req, res) => art.updateArt(req, res));

router.put("/art/update/image",
    isAuthenticated,
    isAuthorized, updateArtImagesValidator,
    (req, res) => art.updateArtImages(req, res));

router.delete("/art/:id",
    isAuthenticated,
    isAuthorized,
    (req, res) => art.remove(req, res));

// ART CATEGORIES
router.post("/art/category",
    isAuthenticated,
    isAuthorized,
    artValidator,
    (req, res) => art.createCategory(req, res));

router.get("/art/category",
    isAuthenticated,
    isAuthorized,
    (req, res) => art.getCategories(req, res));


router.delete("/art/category/:categoryId",
    isAuthenticated,
    isAuthorized,
    (req, res) => art.deleteCategory(req, res));


// PURCHASE
router.post("/art/checkout",
    isAuthenticated,
    isAuthorized,
    (req, res) => purchase.art(req, res));


router.get("/art/checkout/s/:id",
    isAuthenticated,
    isAuthorized,
    (req, res) => purchase.getByTxnId(req, res));

router.get("/art/checkout/all",
    isAuthenticated,
    isAuthorized,
    (req, res) => purchase.getAll(req, res));

router.get("/art/checkout/customer",
    isAuthenticated,
    isAuthorized,
    (req, res) => purchase.getByCustomers(req, res));

router.get("/art/checkout/artist",
    isAuthenticated,
    isAuthorized,
    (req, res) => purchase.getByArtist(req, res));

module.exports = router;
