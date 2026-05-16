const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
<<<<<<< HEAD
    const authHeader = req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Missing or invalid authorization header",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Missing token",
      });
    }
    const decryptedToken = jwt.verify(token, process.env.jwt_secret);
    const userId = decryptedToken.userId;
    req.userId = userId;
    if (!req.body || typeof req.body !== "object") {
      req.body = {};
    }
    req.body.userId = userId;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired session",
    });
  }
};
=======
    //get token from the header
    const token = req.header("authorization").split(" ")[1];
    const decryptedToken = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decryptedToken.userId;
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
>>>>>>> a13aed8a99a2a1ce124a8551daeb4b2d118a213e
