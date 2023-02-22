const verifyAccess = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.userinfo?.access) return res.sendStatus(401);
    const isAllowed = req.userinfo.access.filter((value) =>
      allowedRoles.includes(value)
    );
    if (isAllowed.length === 0 && req?.body?.id) {
      if (req.body.id === req.userinfo.id) isAllowed.push("self");
    }
    if (isAllowed.length === 0) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyAccess;
