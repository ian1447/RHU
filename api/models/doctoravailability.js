import mongoose from "mongoose";
const Schema = mongoose.Schema;

const docavailabilitySchema = new Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    is_available: { type: String, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User" },
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

docavailabilitySchema.pre("save", async function (next) {
  const docavailability = this;
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const DocAvailability = mongoose.model("docavailability", docavailabilitySchema);

export { DocAvailability };
