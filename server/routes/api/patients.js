const express = require("express");
const router = express.Router();
const patientsController = require("../../controllers/patientsController");
const ACCESS = require("../../config/access");
const verifyAccess = require("../../middleware/verifyAccess");

router
  .route("/")
  .get(patientsController.getAllPatients)
  .post(
    // verifyAccess(ACCESS.admin, ACCESS.manager),
    patientsController.createNewPatient
  )
  .put(
    verifyAccess(ACCESS.admin, ACCESS.manager),
    patientsController.updatePatient
  )
  //   .delete(verifyAccess(ACCESS.admin), patientsController.deletePatient);
  .delete(patientsController.deletePatient);

router.route("/:patient_id").get(patientsController.getPatient);

module.exports = router;
