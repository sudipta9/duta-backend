const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req, res, next) => {
  const token = req.header("authorization");
  if (token) {
    try {
      const id = jwt.verify(token, process.env.PRIVATEKEY).id;
      req.userId = id;
      next();
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Authentication failed please login again",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Token missing please log in again",
    });
  }
};

module.exports = isUserAuthenticated;
