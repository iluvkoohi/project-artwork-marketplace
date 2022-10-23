const mongoose = require('mongoose');
const cloudinary = require("../../services/img-upload/cloundinary");
const fs = require("fs");
const Art = require("../../models/art");
const distanceBetween = require("../../helpers/distanceBetween");
const { Profile } = require("../../models/profile");
const ArtCategory = require("../../models/art-categories");

const { throwError } = require("../../const/status");
const { validationResult } = require('express-validator');
const MONETIZATION_PERCENT = process.env.MONETIZATION;

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return throwError(res, errors.array());

    let { description, title, price, videoUrl, category } = req.body;

    const accountId = req.user.data;
    const exclude = { _id: 0, __v: 0, date: 0, contact: 0, gallery: 0, name: 0, accountId: 0, avatar: 0 };

    const profile = await Profile
        .findOne({ accountId })
        .select(exclude);

    if (profile.account.role !== "artist")
        return throwError(res, { message: "Not authorized to perform this action" });

    const cloudOptions = {
        folder: process.env.CLOUDINARY_FOLDER + "/artist/arts",
        unique_filename: true,
    };
    const images = [];
    const files = req.files;

    if (files.length <= 0) return throwError(res, { message: "The allowed minimum of images is 1." });
    if (files.length > 5) return throwError(res, { message: "The allowed maximum of images is 5." });

    for (const file of files) {
        const { path } = file;
        const upload = await cloudinary.uploader.upload(path, cloudOptions);
        images.push({
            url: upload.url,
            description,
            title
        });
        fs.unlinkSync(path);
    }

    return new Art({
        accountId,
        images,
        title,
        description,
        videoUrl,
        category,
        price,
        address: profile.address,
    })
        .save()
        .then((value) => res.status(200).json(value))
        .catch((err) => throwError(res, err));
}


const createCategory = async (req, res) => {
    return new ArtCategory(req.body)
        .save()
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err))
}

const getCategories = async (req, res) => {
    return ArtCategory.find({})
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err))
}


const deleteCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    return ArtCategory.findByIdAndDelete(categoryId)
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err))
}


const getAllArts = (req, res) => {

    const { latitude, longitude, availability = true, sortBy } = req.query;

    if (latitude != undefined && longitude != undefined)
        return Art.find({})
            .select({ __v: 0 })
            .sort({ 'date.createdAt': 'desc' })
            .then((value) => {
                const result = value
                    .map((element, _) => {
                        const fromLat = element.address.coordinates.latitude;
                        const fromLon = element.address.coordinates.longitude;
                        return {
                            ...element._doc,
                            distanceBetween: distanceBetween(fromLat, fromLon, latitude, longitude, "K").toFixed(1) + "km"
                        };
                    })
                    .sort((a, b) => {
                        const value1 = parseFloat(a.distanceBetween.replace(/[^\d.-]/g, ''));
                        const value2 = parseFloat(b.distanceBetween.replace(/[^\d.-]/g, ''));
                        if (sortBy == "desc") return value2 - value1;
                        return value1 - value2;
                    });

                return res.status(200).json(result);
            })
            .catch((err) => throwError(res, err));

    return Art.find({})
        .select({ _id: 0, __v: 0, 'address.coordinates': 0 })
        .sort({ 'date.createdAt': 'desc' })
        .then((value) => res.status(200).json(value))
        .catch((err) => throwError(res, err));
}

const getAllArtsByCategory = (req, res) => {

    const { category, availability = true } = req.query;

    return Art.find({ category })
        .select({ _id: 0, __v: 0, 'address.coordinates': 0 })
        .sort({ 'date.createdAt': 'desc' })
        .then((value) => res.status(200).json(value))
        .catch((err) => throwError(res, err));
}


const getAllArtsByArtist = (req, res) => {
    const { accountId } = req.query;
    return Art.find({ accountId: mongoose.Types.ObjectId(accountId) })
        .select({ __v: 0 })
        .sort({ 'date.createdAt': 'desc' })
        .then((value) => res.status(200).json(value))
        .catch((err) => throwError(res, err));
}

const getById = (req, res) => {
    const _id = req.params.id;
    return Art.findById(_id)
        .select({ __v: 0 })
        .then((value) => {
            if (!value) return throwError(res, { message: "Art not found" });
            return res.status(200).json(value);
        })
        .catch((err) => throwError(res, err));
}

const updateArt = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return throwError(res, errors.array());

        let { _id, title, description, availability, price } = req.body;

        const update = {
            $set: {
                title,
                description,
                availability,
                price,
                "date.updatedAt": Date.now(),
            },
        };
        const options = { new: true };

        Art.findByIdAndUpdate(_id, update, options)
            .then((value) => {
                if (!value) return throwError(res, { message: "Update failed" });
                return res.status(200).json(value);
            })
            .catch((err) => throwError(res, err));

    } catch (error) {
        return throwError(res, error);
    }
}

const updateArtImages = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return throwError(res, errors.array());

        const { _id, _imgId, title, url, description } = req.body;

        const update = {
            $set: {
                'images.$[element].description': description,
                'images.$[element].url': url,
                'images.$[element].title': title,
                'images.$[element].date.updatedAt': Date.now()
            },
        };
        const options = {
            new: true,
            "arrayFilters": [
                { "element._id": mongoose.Types.ObjectId(_imgId) }
            ]
        }

        Art.findByIdAndUpdate(_id, update, options)
            .then((value) => {
                if (!value) return throwError(res, { message: "Update failed" });
                return res.status(200).json(value);
            })
            .catch((err) => throwError(res, err));

    } catch (error) {
        return throwError(res, error);
    }
}

const remove = (req, res) => {
    const _id = req.params.id;
    return Art.findByIdAndDelete(_id)
        .then((value) => {
            if (!value) return throwError(res, { message: "failed" });
            return res.status(200).json({ message: "success" });
        })
        .catch((err) => throwError(res, err));
}

module.exports = {
    create,
    getAllArts,
    getAllArtsByArtist,
    getById,
    updateArt,
    updateArtImages,
    remove,
    getAllArtsByCategory,
    createCategory,
    getCategories,
    deleteCategory
}
