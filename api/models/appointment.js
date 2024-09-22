import mongoose from "mongoose";
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    sex: { type: String, required: true },
    height: { type: String, required: true, default: "0" },
    weight: { type: String, required: true, default: "0" },
    civil_status: { type: String, required: true },
    guardian: { type: String, required: true },
    additional_info: { type: String, required: true },
    prev_medicines: { type: String, required: true },
    past_conditions: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    reason: { type: String, required: true },
    remarks: { type: String},
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// appointmentSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret.password;
//     return ret;
//   }
// });

appointmentSchema.pre("save", async function (next) {
  const appointment = this;
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const Appointment = mongoose.model("appointments", appointmentSchema);

export { Appointment };
