const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ACCESS = require("../../config/access");
const verifyAccess = require("../../middleware/verifyAccess");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(
    // verifyAccess(ACCESS.admin, ACCESS.manager),
    usersController.createNewUser
  )
  .put(verifyAccess(ACCESS.admin, ACCESS.manager), usersController.updateUser)
  //   .delete(verifyAccess(ACCESS.admin), usersController.deleteUser);
  .delete(usersController.deleteUser);

router.route("/:id").get(usersController.getUser);

module.exports = router;
