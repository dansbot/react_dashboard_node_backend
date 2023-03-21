const express = require("express");
const router = express.Router();
const googleDriveController = require("../../controllers/googleDriveController");
const ACCESS = require("../../config/access");
const verifyAccess = require("../../middleware/verifyAccess");

router
  .route("/")
  .get(verifyAccess(ACCESS.read_only), googleDriveController.getFileUrl);

module.exports = router;
