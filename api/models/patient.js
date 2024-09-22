import mongoose from "mongoose";
const Schema = mongoose.Schema;

const patientSchema = new Schema(
	{
		fullname: { type: String, required: true },
		address: { type: String, required: true },
		phone: { type: String },
		email: { type: String, required: true, lowercase: true },
		age: { type: String, required: true },
		gender: { type: String, required: true },
		height: { type: String },
		weight: { type: String },
		blood_pressure: { type: String },
		blood_type: { type: String },
		civil_status: { type: String, required: true },
		parent: { type: String, required: true },
		medical_condition: { type: String, required: true },
		medicine_prescribed: { type: String, required: true },
		additional_information: { type: String, required: true },
		user_id : { type: Schema.Types.ObjectId, required: true, ref: 'User'}
	},
	{
		timestamps: true,
	}
);

patientSchema.pre("save", async function (next) {
	const patient = this;
	if (!patient) return next();

	try {
		next();
	} catch (err) {
		next(err);
	}
});

const Patient = mongoose.model("patient", patientSchema);

export { Patient };
