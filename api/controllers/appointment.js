import { Appointment } from "../models/appointment.js";
import { User } from "../models/user.js";

export async function getAppointment(req, res) {
  try {
    const appointments = await Appointment.find({});
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function createAppointment(req, res) {
  try {
    const {
      date,
      time,
      name,
      address,
      phone_number,
      email,
      sex,
      height,
      weight,
      civil_status,
      guardian,
      additional_info,
      prev_medicines,
      past_conditions,
      status,
      reason,
      user_id,
      remarks
    } = req.body;
    //   if (!password) return res.status(400).json({ err: 'Password is required' });
    const appointment = new Appointment({
      date,
      time,
      name,
      address,
      phone_number,
      email,
      sex,
      height,
      weight,
      civil_status,
      guardian,
      additional_info,
      prev_medicines,
      past_conditions,
      status,
      reason,
      user_id,
      remarks
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function updateAppointment(req, res) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function approvedeclineAppointment(req, res) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status,
        remarks: req.body.remarks } },
      { new: true }
    );

    console.log(appointment);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function deleteAppointment(req, res) {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}
