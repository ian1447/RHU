import { DocAvailability } from "../models/doctoravailability.js";
import { User } from "../models/user.js";

export async function getDocAvailability(req, res) {
  try {
    const docavailability = await DocAvailability.find({}).populate("doctor");
    res.json(docavailability);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function createDocAvailability(req, res) {
  try {
    const { date,time, is_available, doctor } = req.body;
    //   if (!password) return res.status(400).json({ err: 'Password is required' });
    const docavailability = new DocAvailability({
      date,
      time,
      is_available,
      doctor,
    });
    await docavailability.save();
    res.status(201).json(docavailability);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

// export async function updateAppointment(req, res) {
//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });
//     res.json(appointment);
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//     console.log(err.message);
//   }
// }

// export async function approvedeclineAppointment(req, res) {
//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { $set: { status: req.body.status } },
//       { new: true }
//     );

//     console.log(appointment);

//     if (!appointment)
//       return res.status(404).json({ message: "Appointment not found" });
//     res.json(appointment);
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//     console.log(err.message);
//   }
// }

export async function deleteDocAvailability(req, res) {
  try {
    const docavailability = await DocAvailability.findByIdAndDelete(
      req.params.id
    );
    if (!docavailability)
      return res.status(404).json({ message: "Doc Availability not found" });
    res.json({ message: "Availability deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}
