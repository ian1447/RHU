import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck, FaUser, FaChartBar,
  FaPager, FaCalendarAlt, FaAddressCard, FaIdCardAlt, FaEnvelope
} from "react-icons/fa";
import "./header.style.css";

export default function Sidebar() {
  return (
    <div className="sidebar bg-light p-3">
      <h4>RHU Buenavista</h4>
      <ul>
        <li>
          <Link to="/">
            <FaChartBar className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/patient_records">
            <FaIdCardAlt className="icon" /> Patient Records
          </Link>
        </li>
        <li>
          <Link to="/appointments">
            <FaCalendarCheck className="icon" /> Appointments
          </Link>
        </li>
        <li>
          <Link to="/news-events">
            <FaPager className="icon" /> News & Events
          </Link>
        </li>
        <li>
          <Link to="/calendar">
            <FaCalendarAlt className="icon" /> Calendar
          </Link>
        </li>
        <li>
          <Link to="/users">
            <FaUser className="icon" /> Users
          </Link>
        </li>
        {/* <li>
          <Link to="/accounts">
            <FaAddressCard className="icon" /> Accounts
          </Link>
        </li> */}
        {/* <li>
          <Link to="/inbox">
            <FaEnvelope className="icon" /> Message
          </Link>
        </li> */}
      </ul>
    </div>
  );
}
