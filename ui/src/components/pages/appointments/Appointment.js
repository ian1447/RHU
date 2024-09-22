import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { FaPen, FaTrash, FaCheck, FaWindowClose } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Bootstrap from "react-bootstrap";

const Appointment = () => {
	const [appointments, setAppointments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
	const [modalType, setModalType] = useState("Add"); // 'Add' or 'Edit'
	const [formData, setFormData] = useState({
		_id: "",
		name: "",
		address: "",
		phone_number: "",
		email: "",
		age: "",
		sex: "",
		height: "",
		weight: "",
		civil_status: "",
		guardian: "",
		date: "",
		time: "",
		additional_info: "",
		user: "",
		status: "pending",
		reason: "",
		remarks: "",
		prev_medicines: "",
		past_conditions: "",
		user_id: "",
	});
	const [loading, setLoading] = useState(false);
	const [appointmentIdToDelete, setAppointmentIdToDelete] = useState(null); // State to track the appointment ID to delete

	useEffect(() => {
		const fetchAppointments = async () => {
			const token = localStorage.getItem("auth-token");
			const headers = { Authorization: `Bearer ${token}` };
			try {
				const res = await Axios.get("http://localhost:5001/api/appointments", {
					headers,
				});
				setAppointments(res.data);
			} catch (error) {
				console.error("Error fetching appointments:", error);
			}
		};
		fetchAppointments();
	}, []);

	const handleShowModal = (appointment = {}) => {
		setFormData({
			// _id:  appointment._id || "",
			// name:  appointment.name || "",
			// address: appointment.name || "",
			// phone_number: appointment.name || "",
			// email: appointment.name || "",
			// age: appointment.name || "",
			// sex: appointment.name || "",
			// height: appointment.name || "",
			// weight: appointment.name || "",
			// civil_status: appointment.name || "",
			// guardian: appointment.name || "",
			// date: appointment.name || "",
			// time: appointment.name || "",
			// additional_info: appointment.name || "",
			// user: appointment.name || "",
			// status: "Approved",
			// reason: appointment.name || "",
			// prev_medicines: appointment.name || "",
			// past_conditions: appointment.name || "",
			// user_id: appointment.name || "",

			_id: appointment._id || "",
			date: appointment.date || "",
			time: appointment.time || "",
			name: appointment.name || "",
			user: appointment.name || "",
			status: "Approved",
			doctor: "",
			reason: appointment.reason || "",
			user_id: "",
		});
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleApprove = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);
		console.log(formData.status);

		try {
			const { password, ...updateData } = formData; // Exclude password from update data
			const res = await Axios.put(
				`http://localhost:5001/api/appointments/appdec/${formData._id}`,
				updateData,
				{ headers }
			);
			setLoading(false);
			setAppointments(
				appointments.map((appointment) =>
					appointment._id === formData._id ? res.data : appointment
				)
			);
			toast.success("Appointment updated successfully");
		} catch (error) {
			console.error("Error saving appointment:", error);
			toast.error("Error saving appointment");
		}
	};

	const handleShowDeleteModal = (appointment = {}) => {
		setFormData({
			_id: appointment._id || "",
			date: appointment.date || "",
			time: appointment.time || "",
			name: appointment.name || "",
			user: appointment.name || "",
			status: "Declined",
			doctor: "",
			remarks: formData.remarks || "",
			reason: appointment.reason || "",
			user_id: "",
		});
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
	};

	const handleConfirmDelete = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);

		try {
			const { password, ...updateData } = formData; // Exclude password from update data
			const res = await Axios.put(
				`http://localhost:5001/api/appointments/appdec/${formData._id}`,
				updateData,
				{ headers }
			);
			setLoading(false);
			setAppointments(
				appointments.map((appointment) =>
					appointment._id === formData._id ? res.data : appointment
				)
			);
			handleCloseDeleteModal();
			toast.success("Appointment updated successfully");
		} catch (error) {
			console.error("Error saving appointment:", error);
			toast.error("Error saving appointment");
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		}).format(date);
	};

	function formatTime(time24) {
		let [hours, minutes] = time24.split(":").map(Number);
		const suffix = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		return `${hours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
	}

	return (
		<div className="container mt-4 mx-4 p-4">
			<h4 className="d-inline-block">Appointments</h4>
			<Bootstrap.Badge className="ms-2 rounded-pill" bg="primary">
				{appointments.length}
			</Bootstrap.Badge>
			{/* <div className="action-button">
        <Bootstrap.Button
          variant="primary"
          onClick={() => handleShowModal("Add")}
        >
          Add Appointment
        </Bootstrap.Button>
      </div> */}
			<Bootstrap.Table
				responsive
				className="table table-striped table-hover mt-3"
			>
				<thead className="thead-dark">
					<tr>
						<th>ID</th>
						<th>Date</th>
						<th>Time</th>
						<th>Name</th>
						<th>Status</th>
						<th>Reason</th>
						<th>Remarks</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{appointments.map((appointment, index) => (
						<tr key={appointment._id}>
							<td>{index + 1}</td>
							<td>{formatDate(appointment.date)}</td>
							<td>{formatTime(appointment.time)}</td>
							<td>{appointment.name}</td>
							<td>{appointment.status}</td>
							<td>{appointment.reason}</td>
							<td>{appointment.remarks}</td>
							<td>
								{appointment.status === "pending" && (
									<>
										<FaCheck
											style={{
												cursor: "pointer",
												marginRight: "10px",
												color: "blue",
											}}
											onClick={() => handleShowModal(appointment)}
										/>
										<FaWindowClose
											style={{
												cursor: "pointer",
												color: "red",
												paddingLeft: 2,
											}}
											onClick={() => handleShowDeleteModal(appointment)} // Open delete confirmation modal
										/>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Bootstrap.Table>

			{/* Approve Modal */}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Approve</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to approve this appointment?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Cancel
					</Button>
					<Button variant="success" onClick={handleApprove}>
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
						Approve
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Decline Confirmation Modal */}
			<Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Decline</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleConfirmDelete}>
					<Modal.Body>
						<p>Are you sure you want to decline this appointment?</p>
						<Form.Group>
							<Form.Label>Remarks</Form.Label>
							<Form.Control
								as="textarea"
								type="text"
								rows={2}
								style={{ resize: "none", width: "100%" }}
								value={formData.remarks}
								onChange={(e) =>
									setFormData({ ...formData, remarks: e.target.value })
								}
								required
							/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseDeleteModal}>
							Cancel
						</Button>
						<Button variant="danger" type="submit">
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
							Decline
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>

			<ToastContainer position="bottom-right" />
		</div>
	);
};

export default Appointment;
