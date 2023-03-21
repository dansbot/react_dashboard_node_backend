const jwt = require("jsonwebtoken");

const verifyAccess = (...allowedRoles) => {
  return (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res
        .status(401)
        .json({ message: `Unauthorized Access. No web token found.` });
    }
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ error: "Bad request. You are denied." });
        else if (!decoded?.userInfo)
          return res
            .status(403)
            .json({ error: "Bad request. You are not a user." });
        else if (!decoded.userInfo?.access)
          return res
            .status(403)
            .json({ error: "Bad request. You do not have access." });
        const access = decoded.userInfo.access;
        const isAllowed = access.filter((value) =>
          allowedRoles.includes(value)
        );
        if (isAllowed.length === 0 && req?.body?.id) {
          if (req.body.id === decoded.userInfo.id) isAllowed.push("self");
        }
        if (isAllowed.length === 0)
          return res.status(401).json({ error: `User does not have access.` });
        next();
      }
    );
  };
};

module.exports = verifyAccess;
