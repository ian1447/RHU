import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import * as Bootstrap from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaPen, FaTrash, FaPlus, FaInfoCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import ReactSelect from "react-select";

export default function PatientRecords() {
	const [records, setRecords] = useState([]);
	const [users, setUsers] = useState([]);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
	const [modalType, setModalType] = useState("Add"); // 'Add' or 'Edit'
	const [loading, setLoading] = useState(false);
	const [recordIdToDelete, setNewIdToDelete] = useState(null);
	const [formData, setFormData] = useState({
		_id: "",
		fullname: "",
		address: "",
		phone: "",
		email: "",
		age: "",
		gender: "",
		height: "",
		weight: "",
		blood_pressure: "",
		blood_type: "",
		civil_status: "",
		parent: "",
		medical_condition: "",
		medicine_prescribed: "",
		additional_information: "",
		user_id: "",
	});

	useEffect(() => {
		const fetchPatientRecords = async () => {
			const token = localStorage.getItem("auth-token");
			const headers = { Authorization: `Bearer ${token}` };
			try {
				const res = await Axios.get("http://localhost:5001/api/patient", {
					headers,
				});
				setRecords(res.data);
			} catch (error) {
				console.error("Error fetching patient records:", error);
			}
		};
		fetchPatientRecords();
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			const token = localStorage.getItem("auth-token");
			const headers = { Authorization: `Bearer ${token}` };
			try {
				const res = await Axios.get("http://localhost:5001/api/users", {
					headers,
				});
				setUsers(res.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

	const handleShowInfoModal = (records = {}) => {
		setFormData({
			_id: records._id || "",
			fullname: records.fullname || "",
			address: records.address || "",
			phone: records.phone || "",
			email: records.email || "",
			age: records.age || "",
			gender: records.gender || "",
			height: records.height || "",
			weight: records.weight || "",
			blood_pressure: records.blood_pressure || "",
			blood_type: records.blood_type || "",
			civil_status: records.civil_status || "",
			parent: records.parent || "",
			medical_condition: records.medical_condition || "",
			medicine_prescribed: records.medicine_prescribed || "",
			additional_information: records.additional_information || "",
		});
		setShowInfoModal(true);
	};

	const handleCloseInfoModal = () => {
		setShowInfoModal(false);
	};

	const handleShowModal = (type, records = {}) => {
		setModalType(type);
		setFormData({
			_id: records._id || "",
			fullname: records.fullname || "",
			address: records.address || "",
			phone: records.phone || "",
			email: records.email || "",
			age: records.age || "",
			gender: records.gender || "",
			height: records.height || "",
			weight: records.weight || "",
			blood_pressure: records.blood_pressure || "",
			blood_type: records.blood_type || "",
			civil_status: records.civil_status || "",
			parent: records.parent || "",
			medical_condition: records.medical_condition || "",
			medicine_prescribed: records.medicine_prescribed || "",
			additional_information: records.additional_information || "",
			user_id: "",
		});
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleShowDeleteModal = (id) => {
		setNewIdToDelete(id); // Set the user ID to delete
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
	};

	const handleConfirmDelete = async () => {
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);

		try {
			await Axios.delete(
				`http://localhost:5001/api/patient/${recordIdToDelete}`,
				{
					headers,
				}
			);
			setLoading(false);
			setRecords(records.filter((record) => record._id !== recordIdToDelete));
			toast.success("Patient record deleted successfully");
		} catch (error) {
			setLoading(false);
			console.error("Error deleting record:", error);
			toast.error("Error deleting record");
		} finally {
			handleCloseDeleteModal(); // Close the confirmation modal after deletion
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);
		try {
			if (modalType === "Add") {
				const res = await Axios.post(
					"http://localhost:5001/api/patient",
					formData,
					{ headers }
				);
				setLoading(false);
				setRecords([...records, res.data]);
				toast.success("Patient record added successfully");
			} else {
				const { password, ...updateData } = formData; // Exclude password from update data
				const res = await Axios.put(
					`http://localhost:5001/api/patient/${formData._id}`,
					updateData,
					{ headers }
				);
				setLoading(false);
				setRecords(
					records.map((record) =>
						record._id === formData._id ? res.data : record
					)
				);
				toast.success("Patient record updated successfully");
			}
			handleCloseModal();
		} catch (error) {
			console.error("Error saving record:", error);
			toast.error("Error saving record");
		}
	};

	return (
		<div className="container mt-4 mx-4 p-4">
			<h4 className="d-inline-block">Patient Records</h4>
			<Bootstrap.Badge className="ms-2 rounded-pill" bg="primary">
				{records.length}
			</Bootstrap.Badge>
			<div className="action-button">
				<Bootstrap.Button
					variant="primary"
					onClick={() => handleShowModal("Add")}
				>
					<FaPlus
						size="1em"
						style={{ marginRight: "10px", verticalAlign: "middle" }}
					/>
					Add Records
				</Bootstrap.Button>
			</div>
			<Bootstrap.Table
				responsive
				className="table table-striped table-hover mt-3"
			>
				<thead className="thead-dark">
					<tr>
						<th>Name</th>
						<th>Address</th>
						<th>Email</th>
						<th>Phone No.</th>
						<th>Medical Condition</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{records.map((record) => (
						<tr key={record._id}>
							<td>{record.fullname}</td>
							<td>{record.address}</td>
							<td>{record.email}</td>
							<td>{record.phone}</td>
							<td>{record.medical_condition}</td>
							<td>
								<FaInfoCircle
									style={{
										cursor: "pointer",
										marginRight: "10px",
										color: "gray",
									}}
									onClick={() => handleShowInfoModal(record)}
								/>
								<FaPen
									style={{
										cursor: "pointer",
										marginRight: "10px",
										color: "blue",
									}}
									onClick={() => handleShowModal("Edit", record)}
								/>
								<FaTrash
									style={{ cursor: "pointer", color: "red", paddingLeft: 2 }}
									onClick={() => handleShowDeleteModal(record._id)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</Bootstrap.Table>

			<Bootstrap.Modal show={showModal} onHide={handleCloseModal} size="xl">
				<Bootstrap.Modal.Header closeButton>
					<Bootstrap.Modal.Title>
						{modalType} Patient Record
					</Bootstrap.Modal.Title>
				</Bootstrap.Modal.Header>
				<Bootstrap.Modal.Body>
					<Bootstrap.Form onSubmit={handleSubmit}>
						<div className="row">
							{/* Full Name */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Full Name</Bootstrap.Form.Label>
									<ReactSelect
										options={users
											.map((user) => ({
												value: `${user.firstname} ${user.lastname}`,
												label: `${user.lastname}, ${user.firstname}`,
												id: user._id, // Store the user's ID
											}))
											.sort((a, b) => a.label.localeCompare(b.label))} // Sort alphabetically by label
										value={
											formData.fullname
												? { value: formData.fullname, label: formData.fullname }
												: null
										}
										onChange={(selectedOption) => {
											setFormData({
												...formData,
												fullname: selectedOption ? selectedOption.value : "",
												user_id: selectedOption ? selectedOption.id : "", // Set user_id in formData
											});
										}}
										placeholder="Select Full Name"
										isClearable
										isSearchable
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Address */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Address</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="text"
										value={formData.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Phone Number */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Phone Number</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="text"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Email */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Email</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Age */}
							<div className="col-md-3 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Age</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="number"
										value={formData.age}
										onChange={(e) =>
											setFormData({ ...formData, age: e.target.value })
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Gender */}
							<div className="col-md-3 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Gender</Bootstrap.Form.Label>
									<Bootstrap.Form.Select
										value={formData.gender}
										onChange={(e) =>
											setFormData({ ...formData, gender: e.target.value })
										}
										required
									>
										<option value="">Select Gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</Bootstrap.Form.Select>
								</Bootstrap.Form.Group>
							</div>

							{/* Height */}
							<div className="col-md-3 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Height</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="text"
										value={formData.height}
										onChange={(e) =>
											setFormData({ ...formData, height: e.target.value })
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Weight */}
							<div className="col-md-3 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Weight</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="text"
										value={formData.weight}
										onChange={(e) =>
											setFormData({ ...formData, weight: e.target.value })
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Blood Pressure */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Blood Pressure</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="text"
										value={formData.blood_pressure}
										onChange={(e) =>
											setFormData({
												...formData,
												blood_pressure: e.target.value,
											})
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Blood Type */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Blood Type</Bootstrap.Form.Label>
									<Bootstrap.Form.Select
										value={formData.blood_type}
										onChange={(e) =>
											setFormData({ ...formData, blood_type: e.target.value })
										}
									>
										<option value="">Select Blood Type</option>
										<option value="A+">A+</option>
										<option value="A-">A-</option>
										<option value="B+">B+</option>
										<option value="B-">B-</option>
										<option value="AB+">AB+</option>
										<option value="AB-">AB-</option>
										<option value="O+">O+</option>
										<option value="O-">O-</option>
									</Bootstrap.Form.Select>
								</Bootstrap.Form.Group>
							</div>

							{/* Civil Status */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Civil Status</Bootstrap.Form.Label>
									<Bootstrap.Form.Select
										value={formData.civil_status}
										onChange={(e) =>
											setFormData({ ...formData, civil_status: e.target.value })
										}
										required
									>
										<option value="">Select Civil Status</option>
										<option value="Single">Single</option>
										<option value="Married">Married</option>
										<option value="Divorced">Divorced</option>
										<option value="Widowed">Widowed</option>
									</Bootstrap.Form.Select>
								</Bootstrap.Form.Group>
							</div>

							{/* Parent/Guardian/Spouse */}
							<div className="col-md-6 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>
										Parent/Guardian/Spouse
									</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										type="text"
										value={formData.parent}
										onChange={(e) =>
											setFormData({
												...formData,
												parent: e.target.value,
											})
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Medical Condition */}
							<div className="col-md-12 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>Medical Condition</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										as="textarea"
										rows={3}
										value={formData.medical_condition}
										onChange={(e) =>
											setFormData({
												...formData,
												medical_condition: e.target.value,
											})
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Medicine Prescribed */}
							<div className="col-md-12 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>
										Medicine Prescribed
									</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										as="textarea"
										rows={3}
										value={formData.medicine_prescribed}
										onChange={(e) =>
											setFormData({
												...formData,
												medicine_prescribed: e.target.value,
											})
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>

							{/* Additional Information */}
							<div className="col-md-12 mb-3">
								<Bootstrap.Form.Group>
									<Bootstrap.Form.Label>
										Additional Information
									</Bootstrap.Form.Label>
									<Bootstrap.Form.Control
										as="textarea"
										rows={3}
										value={formData.additional_information}
										onChange={(e) =>
											setFormData({
												...formData,
												additional_information: e.target.value,
											})
										}
										required
									/>
								</Bootstrap.Form.Group>
							</div>
						</div>

						<div className="action-button mt-3">
							<Bootstrap.Button variant="primary" type="submit">
								{loading ? (
									<Bootstrap.Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										style={{ marginRight: "10px" }}
									/>
								) : null}
								{modalType === "Add"
									? "Add Patient Record"
									: "Update Patient Record"}
							</Bootstrap.Button>
						</div>
					</Bootstrap.Form>
				</Bootstrap.Modal.Body>
			</Bootstrap.Modal>

			{/* Display Patient Record */}
			<Bootstrap.Modal
				show={showInfoModal}
				onHide={handleCloseInfoModal}
				size="xl"
			>
				<Bootstrap.Modal.Header closeButton>
					<Bootstrap.Modal.Title>Patient Information</Bootstrap.Modal.Title>
				</Bootstrap.Modal.Header>
				<Bootstrap.Modal.Body>
					<div className="row">
						{/* Full Name */}
						<div className="col-md-6 mb-3">
							<p>
								<strong>Full Name:</strong> {formData.fullname}
							</p>
						</div>

						{/* Address */}
						<div className="col-md-6 mb-3">
							<p>
								<strong>Address:</strong> {formData.address}
							</p>
						</div>

						{/* Phone Number */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Phone Number:</strong> {formData.phone}
							</p>
						</div>

						{/* Email */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Email:</strong> {formData.email}
							</p>
						</div>

						{/* Age */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Age:</strong> {formData.age}
							</p>
						</div>

						{/* Gender */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Gender:</strong> {formData.gender}
							</p>
						</div>

						{/* Height */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Height:</strong> {formData.height}
							</p>
						</div>

						{/* Weight */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Weight:</strong> {formData.weight}
							</p>
						</div>

						{/* Blood Pressure */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Blood Pressure:</strong> {formData.blood_pressure}
							</p>
						</div>

						{/* Blood Type */}
						<div className="col-md-3 mb-3">
							<p>
								<strong>Blood Type:</strong> {formData.blood_type}
							</p>
						</div>

						{/* Civil Status */}
						<div className="col-md-6 mb-3">
							<p>
								<strong>Civil Status:</strong> {formData.civil_status}
							</p>
						</div>

						{/* Parent/Guardian/Spouse */}
						<div className="col-md-6 mb-3">
							<p>
								<strong>Parent/Guardian/Spouse:</strong> {formData.parent}
							</p>
						</div>

						{/* Medical Condition */}
						<div className="col-md-6 mb-3">
							<p>
								<strong>Medical Condition:</strong> {formData.medical_condition}
							</p>
						</div>

						{/* Medicine Prescribed */}
						<div className="col-md-6 mb-3">
							<p>
								<strong>Medicine Prescribed:</strong>{" "}
								{formData.medicine_prescribed}
							</p>
						</div>

						{/* Additional Information */}
						<div className="col-md-12 mb-3">
							<p>
								<strong>Additional Information:</strong>{" "}
								{formData.additional_information}
							</p>
						</div>
					</div>
				</Bootstrap.Modal.Body>
			</Bootstrap.Modal>

			{/* Delete Confirmation Modal */}
			<Bootstrap.Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
				<Bootstrap.Modal.Header closeButton>
					<Bootstrap.Modal.Title>Confirm Deletion</Bootstrap.Modal.Title>
				</Bootstrap.Modal.Header>
				<Bootstrap.Modal.Body>
					<p>Are you sure you want to delete this record?</p>
				</Bootstrap.Modal.Body>
				<Bootstrap.Modal.Footer>
					<Bootstrap.Button
						variant="secondary"
						onClick={handleCloseDeleteModal}
					>
						Cancel
					</Bootstrap.Button>
					<Bootstrap.Button variant="danger" onClick={handleConfirmDelete}>
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
					</Bootstrap.Button>
				</Bootstrap.Modal.Footer>
			</Bootstrap.Modal>

			<ToastContainer position="bottom-right" />
		</div>
	);
}
