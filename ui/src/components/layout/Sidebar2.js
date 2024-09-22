import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck, FaUser, FaLocationArrow, FaChartBar,
  FaPager, FaPhoneAlt, FaAddressCard, FaIdCardAlt, FaEnvelope
} from "react-icons/fa";
import "./header.style.css";

export default function Sidebar2() {
  return (
    <div className="sidebar bg-light p-3">
      <h4>RHU Buenavista</h4>
      <ul>
        <li>
          <Link to="/doctorAvailability">
            <FaCalendarCheck className="icon" /> Availability
          </Link>
        </li>
        <li>
          <Link to="/docAppointments">
            <FaPager className="icon" /> Appointments Schedule
          </Link>
        </li>
      </ul>
    </div>
  );
}
