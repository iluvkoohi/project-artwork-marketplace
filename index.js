require("dotenv").config();
const port = process.env.PORT || 5000;
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser')

const { fileFilter, storage } = require("./services/img-upload/fileFilter");

try {
  mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => console.log("SERVER IS CONNECTED"))
    .catch(() => console.log("SERVER CANNOT CONNECT"));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });

  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://artwork-marketplace-v1.netlify.app',
      "https://project-artwork-marketplace.vercel.app",
      "https://test-artworkmarketplace-api.herokuapp.com"
    ],
    credentials: true
  }));

  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '25mb', extended: true }));
  app.use(multer({ storage, fileFilter }).array("media"));

  app.use("/api", require("./routes/routeUser"));
  app.use("/api", require("./routes/routeProfile"));
  app.use("/api", require("./routes/routeArt"));
  app.use("/api", require("./routes/routeUpload"));
  app.use("/api", require("./routes/routeTicket"));
  app.use("/api", require("./routes/routeValidate"));
  app.use("/api", require("./routes/routeStripe"));
  app.use("/api", require("./controllers/cartController"));
  app.use("/api", require("./controllers/statusController"));

  app.listen(port, () => console.log(`SERVER IS RUNNING ON ${port}`));
} catch (error) {
  console.log(error);
}
