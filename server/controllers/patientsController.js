const Patient = require("../data/Patient");

const getAllPatients = async (req, res) => {
  const patients = await Patient.find().select(
    "_id patient_id sex age height weight diagnosis"
  );
  if (!patients) return res.status(204).json({ message: "No patients found." });
  res.json(patients);
};

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

const createNewPatient = async (req, res) => {
  if (!req?.body?.patient_id) {
    return res.status(400).json({
      message: `patient_id is required, sent: ${JSON.stringify(req.body)}`,
    });
  }
  try {
    const newPatient = {};
    for (const key of Object.keys(Patient.schema.paths)) {
      if (req.body.hasOwnProperty(key)) {
        newPatient[key] = req.body[key];
      }
    }
    const result = await Patient.create(newPatient);
    res.status(201).json(result);
  } catch (err) {
    return res.status(409).json({
      message: `Patient with patient_id "${req.body.patient_id}" already exists`,
    });
  }
};

const updatePatient = async (req, res) => {
  if (!req?.body?.patient_id)
    return res.status(400).json({ message: "Patient ID is required." });
  const patient = await Patient.findOne({
    patient_id: req.body.patient_id,
  }).exec();
  if (!patient) {
    return res
      .status(204)
      .json({ message: `Patient ID "${req.body.patient_id}" not found.` });
  }
  for (const key of Object.keys(Patient.schema.paths)) {
    if (req.body.hasOwnProperty(key)) {
      patient[key] = req.body[key];
    }
  }

  const result = await patient.save();
  res.json(result);
};

const deletePatient = async (req, res) => {
  if (!req?.body?.patient_id)
    return res.status(400).json({ message: "Patient ID is required." });
  const patient = await Patient.findOne({
    patient_id: req.body.patient_id,
  }).exec();
  if (!patient) {
    return res
      .status(204)
      .json({ message: `Patient ID "${req.body.patient_id}" not found.` });
  }
  const result = await patient.deleteOne({ patient_id: req.body.patient_id });
  res.json(result);
};

module.exports = {
  getAllPatients,
  getPatient,
  createNewPatient,
  updatePatient,
  deletePatient,
};
