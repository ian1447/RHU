import { Patient } from "../models/patient.js";
import { Profile } from "../models/profile.js";

// Get all users
export async function getPatientRecords(req, res) {
	try {
		const patient = await Patient.find({});
		res.json(patient);
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
}

// Get a single user by ID
export async function getPatientRecord(req, res) {
	try {
		const patient = await Patient.findById(req.params.id);
		if (!patient)
			return res.status(404).json({ message: "Patient record not found!" });
		res.json(patient);
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
}

// Create a new record
export async function createPatientRecord(req, res) {
	try {
		const {
			fullname,
			address,
			phone,
			email,
			age,
			gender,
			height,
			weight,
			blood_pressure,
			blood_type,
			civil_status,
			parent,
			medical_condition,
			medicine_prescribed,
      additional_information,
      user_id
		} = req.body;
		if (!fullname) return res.status(400).json({ err: "Fullname is required" });
		if (!address) return res.status(400).json({ err: "Address is required" });
		if (!email) return res.status(400).json({ err: "Email is required" });
		if (!age) return res.status(400).json({ err: "Age is required" });
		if (!gender) return res.status(400).json({ err: "Gender is required" });
		if (!medical_condition)
			return res.status(400).json({ err: "Medical Condition is required" });
		if (!medicine_prescribed)
			return res.status(400).json({ err: "Medicine Prescribed is required" });

		const patient = new Patient({
			fullname,
			address,
			phone,
			email,
			age,
			gender,
			height,
			weight,
			blood_pressure,
			blood_type,
			civil_status,
			parent,
			medical_condition,
			medicine_prescribed,
      additional_information,
      user_id
		});
		await patient.save();
		res.status(201).json(patient);
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
}

// Update a record
export async function updatePatientRecord(req, res) {
	try {
		const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!patient) return res.status(404).json({ message: "Patient not found" });
		res.json(patient);
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
}

// Delete a user
export async function deletePatientRecord(req, res) {
	try {
		const patient = await Patient.findByIdAndDelete(req.params.id);
		if (!patient) return res.status(404).json({ message: "Patient not found" });
		res.json({ message: "Patient deleted" });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
}
