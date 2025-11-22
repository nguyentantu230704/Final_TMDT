const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token not found",
    });
  }

  // 🔸 Nếu token có tiền tố "Bearer " thì cắt bỏ
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Access token is invalid",
      });
    }

    req.user = decoded; // chứa { id, isAdmin, iat, exp }

    next();
  });
};

const verifyAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) next();
    else {
      res.status(403).json({
        status: "error",
        message: "you are not authorized to perform this action",
      });
    }
  });
};

const verifyAdminAccess = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) next();
    else {
      res.status(403).json({
        status: "error",
        message: "you are not authorized to perform this action",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAuthorization,
  verifyAdminAccess,
};
