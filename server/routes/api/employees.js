const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const ACCESS = require("../../config/access");
const verifyAccess = require("../../middleware/verifyAccess");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyAccess(ACCESS.admin, ACCESS.manager),
    employeesController.createNewEmployee
  )
  .put(
    verifyAccess(ACCESS.admin, ACCESS.manager),
    employeesController.updateEmployee
  )
  .delete(verifyAccess(ACCESS.admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
