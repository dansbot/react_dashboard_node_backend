const Patient = require("../data/Patient");

const getPatient = async (req, res) => {
  if (!req?.params?.patient_id)
    return res
      .status(400)
      .json({ message: "patient_id parameter is required." });
  const patient = await Patient.findOne({
    patient_id: req.params.patient_id,
  }).exec();
  if (!patient)
    return res
      .status(204)
      .json({ message: `Patient ID "${req.params.patient_id}" not found.` });
  res.json(patient);
};

module.exports = { getPatient };
