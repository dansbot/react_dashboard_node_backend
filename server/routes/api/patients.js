const express = require("express");
const router = express.Router();
const patientsController = require("../../controllers/patientsController");
const ACCESS = require("../../config/access");
const verifyAccess = require("../../middleware/verifyAccess");

router
  .route("/")
  .get(verifyAccess(ACCESS.read_only), patientsController.getAllPatients)
  .post(
    verifyAccess(
      ACCESS.admin,
      ACCESS.manager,
      ACCESS.reviewer,
      ACCESS.annotater
    ),
    patientsController.createNewPatient
  )
  .put(
    verifyAccess(
      ACCESS.admin,
      ACCESS.manager,
      ACCESS.reviewer,
      ACCESS.annotater
    ),
    patientsController.updatePatient
  )
  .delete(
    verifyAccess(ACCESS.admin, ACCESS.manager),
    patientsController.deletePatient
  );

router.route("/:patient_id").get(patientsController.getPatient);

module.exports = router;
