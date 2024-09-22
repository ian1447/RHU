// npm packages
import "dotenv/config.js";
import express from "express";
import logger from "morgan";
import cors from "cors";
import formData from "express-form-data";

// connect to MongoDB with mongoose
import "./config/database.js";

// import routes
import { router as profilesRouter } from "./routes/profiles.js";
import { router as authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { appointmentRouter } from "./routes/appointment.js";
import { newsRouter } from "./routes/news.js";
import { docavailabilityRouter } from "./routes/docavailability.js";
import { patientRouter } from './routes/patient.js';

// create the express app
const app = express();

// basic middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(formData.parse());

// mount imported routes
app.use("/api/profiles", profilesRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/news", newsRouter);
app.use("/api/docavailability", docavailabilityRouter);
app.use('/api/patient', patientRouter);

// handle 404 errors
app.use(function (req, res, next) {
  res.status(404).json({ err: "Not found" });
});

// handle all other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ err: err.message });
});

export { app };
