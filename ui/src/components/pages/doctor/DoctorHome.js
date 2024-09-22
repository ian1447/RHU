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
import * as Bootstrap from "react-bootstrap";
import "./doctor.home.styles.css"; // Custom CSS for calendar styling
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash } from "react-icons/fa";

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
	const [_time, setTime] = useState("");

	const handleSubmit = () => {
		if (availability) {
			addEvent(date, availability, _time);
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
					<div className="row">
						<div className="col-md-6 d-flex align-items-center">
							<Form.Label className="mr-2">Availability</Form.Label>
							<Form.Control
								as="select"
								value={availability}
								onChange={(e) => setAvailability(e.target.value)}
							>
								<option value="">Select...</option>
								<option value="Available">Available</option>
								<option value="Unavailable">Unavailable</option>
							</Form.Control>
						</div>
						{availability === "Available" && (
							<div className="col-md-6 d-flex align-items-center">
								<Form.Label className="mr-2">Time</Form.Label>
								<Form.Control
									type="time"
									required
									value={_time}
									onChange={(e) => setTime(e.target.value)}
								/>
							</div>
						)}
					</div>
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

export default function DocDashboard() {
	const { userData } = useContext(UserContext);
	const [date, setDate] = useState(new Date());
	const [events, setEvents] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		date: "",
		time: "",
		is_available: "",
		doctor: userData.user_id,
	});
	const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
	const [deleteid, setDeleteid] = useState("");
	const [availabilitydates, SetAvailabilitydates] = useState([]);

	// useEffect(() => {
	// 	console.log("$$testdata", formData);
	// })

	useEffect(() => {
		const fetchDocAvailability = async () => {
			const token = localStorage.getItem("auth-token");
			const headers = { Authorization: `Bearer ${token}` };
			try {
				const res = await Axios.get(
					"http://localhost:5001/api/docavailability",
					{
						headers,
					}
				);
				console.log("$$Fetched appointments:", res.data); // Log the fetched data
				SetAvailabilitydates(res.data);
			} catch (error) {
				console.error("Error fetching docAvailability:", error);
			}
		};
		fetchDocAvailability();
	}, []);

	const handleSubmit = async (date, availability, _time) => {
		const updatedFormData = {
			...formData,
			is_available: availability,
			time: _time,
		};
		setFormData(updatedFormData);

		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);
		if (availability === "Available") {
			try {
				const res = await Axios.post(
					"http://localhost:5001/api/docavailability",
					updatedFormData,
					{ headers }
				);

				setLoading(false);
				SetAvailabilitydates([...availabilitydates, res.data]);
				toast.success("Availability added successfully");
				handleClose();
			} catch (error) {
				console.error("Error saving Availability:", error);
				toast.error("Error saving Availability");
			}
		} else {
			if (checkAvailabilityDelete(date) === "") {
			} else {
				try {
					await Axios.delete(
						`http://localhost:5001/api/docavailability/${checkAvailabilityDelete(
							date
						)}`,
						{
							headers,
						}
					);
					setLoading(false);

					SetAvailabilitydates(
						availabilitydates.filter(
							(availabilitydates) =>
								availabilitydates._id !== checkAvailabilityDelete(date)
						)
					);
					toast.success("Availability deleted successfully");
					handleClose();
				} catch (error) {
					setLoading(false);
					console.error("Error deleting Availability:", error);
					toast.error("Error deleting Availability");
				}
			}
		}
	};

	useEffect(() => {
		if (userData) {
			// console.log("User Data:", userData);
		} else {
			console.log("You need to login to this website to access.");
		}
	}, [userData]);

	const handleDateChange = (newDate) => {
		setDate(newDate);
		setFormData({ ...formData, date: newDate });
		setShowModal(true);
	};

	const handleClose = () => setShowModal(false);

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
	};

	const handleShowDeleteModal = (id) => {
		setDeleteid(id);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);
		console.log(formData.status);

		try {
			await Axios.delete(
				`http://localhost:5001/api/docavailability/${deleteid}`,
				{
					headers,
				}
			);
			setLoading(false);

			SetAvailabilitydates(
				availabilitydates.filter(
					(availabilitydates) => availabilitydates._id !== deleteid
				)
			);
			setLoading(false);
			toast.success("Availability deleted successfully");
		} catch (error) {
			setLoading(false);
			console.error("Error deleting Availability:", error);
			toast.error("Error deleting Availability");
		} finally {
			handleCloseDeleteModal(); // Close the confirmation modal after deletion
		}
	};

	// const addEvent = (date, availability) => {
	// 	const dateKey = date.toDateString();
	// 	setEvents((prevEvents) => ({
	// 		...prevEvents,
	// 		[dateKey]: availability,
	// 	}));
	// 	setFormData({ ...formData, is_available: availability})
	// };

	const getAvailableDates = () => {
		return Object.keys(availabilitydates).filter(
			(dateKey) => availabilitydates[dateKey] === "Available"
		);
	};

	const checkAvailabilityDelete = (date) => {
		const dateKey = new Date(date).toDateString();
		const event = availabilitydates.find(
			(item) => new Date(item.date).toDateString() === dateKey
		);
		return event?.is_available === "Available" ? event._id : "";
	};

	const checkAvailability = (date) => {
		const dateKey = new Date(date).toDateString();
		const event = availabilitydates.find(
			(item) => new Date(item.date).toDateString() === dateKey
		);
		return event?.is_available === "Available" ? "Available" : "";
	};

	const formatDateForForm = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();

		// Array of month names
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const month = monthNames[date.getMonth()]; // Get month name
		const day = String(date.getDate()).padStart(2, "0");

		return `${month} ${day}, ${year}`;
	};

	function formatTime(time24) {
		let [hours, minutes] = time24.split(":").map(Number);
		const suffix = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		return `${hours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
	}

	return (
		<div className="container mt-4 mx-4 p-4">
			<>
				<h4>Set Availability</h4>
				<div className="dashboard-container">
					<div className="calendar-section">
						<Calendar
							onChange={handleDateChange}
							value={date}
							tileContent={({ date, view }) => {
								if (view === "month") {
									return (
										<div className="event-tile-content">
											{checkAvailability(date) && (
												<Button variant="light">
													{checkAvailability(date)}
												</Button>
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
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{availabilitydates.map((availability, index) => (
									<tr key={index}>
										<td>
											{formatDateForForm(availability.date)} -{" "}
											{formatTime(availability.time)}
										</td>
										<td>
											{" "}
											<FaTrash
												style={{
													cursor: "pointer",
													marginRight: "10px",
													color: "red",
												}}
												onClick={() => handleShowDeleteModal(availability._id)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<EventModal
						show={showModal}
						handleClose={handleClose}
						date={date}
						addEvent={handleSubmit}
					/>
					{/* Decline Confirmation Modal */}
					<Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
						<Modal.Header closeButton>
							<Modal.Title>Confirm Delete</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>Are you sure you want to delete availability</p>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleCloseDeleteModal}>
								Cancel
							</Button>
							<Button variant="danger" onClick={handleConfirmDelete}>
								{loading ? (
									<Bootstrap.Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										style={{ marginRight: "10px" }}
									/>
								) : (
									""
								)}
								Delete
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</>
		</div>
	);
}
