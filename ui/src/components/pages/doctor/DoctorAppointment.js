import React, { useState, useContext, useEffect } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Modal, Button, Form } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { UserContext } from "../../../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./doctor.home.styles.css"; // Custom CSS for calendar styling

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const EventModal = ({ show, handleClose, date, addEvent }) => {
	const [availability, setAvailability] = useState("");

	const handleSubmit = () => {
		if (availability) {
			addEvent(date, availability);
			handleClose();
		}
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Set Availability</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group controlId="availabilityInput">
					<Form.Label>Availability</Form.Label>
					<Form.Control
						as="select"
						value={availability}
						onChange={(e) => setAvailability(e.target.value)}
					>
						<option value="">Select...</option>
						<option value="Available">Available</option>
						<option value="Unavailable">Unavailable</option>
					</Form.Control>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={handleSubmit}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default function DocAppointment() {
	const { userData } = useContext(UserContext);
	const [date, setDate] = useState(new Date());
	const [events, setEvents] = useState({});
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (userData) {
			// console.log("User Data:", userData);
		} else {
			console.log("You need to login to this website to access.");
		}
	}, [userData]);

	const handleDateChange = (newDate) => {
		setDate(newDate);
		setShowModal(true);
	};

	const handleClose = () => setShowModal(false);

	const addEvent = (date, availability) => {
		const dateKey = date.toDateString();
		setEvents((prevEvents) => ({
			...prevEvents,
			[dateKey]: availability,
		}));
	};

	const getAvailableDates = () => {
		return Object.keys(events).filter(
			(dateKey) => events[dateKey] === "Available"
		);
	};

	return (
		<div className="container mt-4 mx-4 p-4">
			<>
				<h4>Schedules</h4>
				<div className="dashboard-container">
					<div className="calendar-section">
						<Calendar
							onChange={handleDateChange}
							value={date}
							tileContent={({ date, view }) => {
								if (view === "month") {
									const dateKey = date.toDateString();
									return (
										<div className="event-tile-content">
											{events[dateKey] ? (
												<Button variant="light">{events[dateKey]}</Button>
											) : (
												""
											)}
										</div>
									);
								}
							}}
							className="custom-calendar"
						/>
					</div>
					<div className="list-section">
						<h4 style={{ color: "gray" }}>List of Available Dates</h4>
						<table className="table table-bordered">
							<thead className="thead-dark">
								<tr>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{getAvailableDates().map((dateKey, index) => (
									<tr key={index}>
										<td>{dateKey}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<EventModal
						show={showModal}
						handleClose={handleClose}
						date={date}
						addEvent={addEvent}
					/>
				</div>
			</>
		</div>
	);
}
