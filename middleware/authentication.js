require("dotenv").config();
const jwt = require("jsonwebtoken");
const { throwAuthError } = require("../const/status");

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return throwAuthError(res, { message: "Not Authenticated" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, value) => {
      if (err) throwAuthError(res, { message: "Auhtentication Token is invalid or expired" });
      req.user = value;

      console.log({
        token,
        value
      })
      next();
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  isAuthenticated
};
