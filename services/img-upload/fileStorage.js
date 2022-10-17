const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "media");
  },
  filename: (req, file, callback) => {
    callback(null, uuidv4() + path.extname(file.originalname));
  },
});
exports.fileStorage = fileStorage;
