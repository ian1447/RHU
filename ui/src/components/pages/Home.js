import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../../context/UserContext";
import { useHistory } from 'react-router-dom';
import {
	Container,
	Row,
	Col,
	Button,
	Table,
	Modal,
	Form,
	Spinner,
	Dropdown,
	Card,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import Hero from "../assets/hero.webp";
import AboutHero from "../assets/about.webp";
import { FaAngleDoubleUp, FaWeight } from "react-icons/fa";

export default function Home() {
	const { userData } = useContext(UserContext);
	const [news, setNews] = useState([]);
	const [appointments, setAppointments] = useState([]);
	const [doctors, setDoctors] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showScroll, setShowScroll] = useState(false);
	const [formData, setFormData] = useState({
		_id: "",
		name: userData.name,
		address: "",
		phone_number: "",
		email: userData.email,
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
		doctor: "",
		reason: "",
		prev_medicines: "None",
		past_conditions: "None",
		user_id: userData.user_id,
	});

	const [selectedMedicines, setSelectedMedicines] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [step, setStep] = useState(1);
	const [date, setDate] = useState(new Date());
	const [events, setEvents] = useState({});
	const [availabilitydates, SetAvailabilitydates] = useState([]);

	const history = useHistory();

	const handleNextStep = () => {
		if (checkAvailability(date) === "Available") {
			setStep((prevStep) => prevStep + 1);
		} else {
			window.alert("Date is not Available");
		}
	};

	const handlePrevStep = () => {
		setStep((prevStep) => prevStep - 1);
	};

	const handleDateChange = (newDate) => {
		setDate(newDate);
		setFormData({ ...formData, date: formatDateForForm(newDate) });
	};

	const handleNewsItemClick = (item) => {
		console.log('$$Item', item);
		history.push({
			pathname: '/news',
			state: { newsItem: item }
		});
	};

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
				SetAvailabilitydates(res.data);
			} catch (error) {
				console.error("Error fetching docAvailability:", error);
			}
		};
		fetchDocAvailability();
	}, []);

	const Medicines = [
		{ label: "Ibuprofen", value: "Ibuprofen" },
		{ label: "Paracetamol", value: "Paracetamol" },
		{ label: "Albuterol", value: "Albuterol" },
		{ label: "Antibiotics", value: "Antibiotics" },
		{ label: "Cetirizine", value: "Cetirizine" },
		{ label: "Loratadine", value: "Loratadine" },
		{ label: "Loperamide", value: "Loperamide" },
		{ label: "Triptans", value: "Triptans" },
		{ label: "Omeprazol", value: "Omeprazol" },
	];

	const PastMedicalCondition = [
		{ label: "Fever", value: "Fever" },
		{ label: "Asthma", value: "Asthma" },
		{ label: "Pneumonia", value: "Pneumonia" },
		{ label: "Allergies", value: "Allergies" },
		{ label: "Conjunctivitis", value: "Conjunctivitis" },
		{ label: "Diarrhea", value: "Diarrhea" },
		{ label: "Headaches", value: "Headaches" },
		{ label: "Mononucleosis", value: "Mononucleosis" },
		{ label: "Stomach Aches", value: "Stomach Aches" },
	];

	const handleMultiSelectChangeMedicines = (category, value) => {
		setSelectedMedicines((prevSelectedOptions) => {
			let updatedSelectedOptions;
			if (prevSelectedOptions.includes(value)) {
				updatedSelectedOptions = prevSelectedOptions.filter(
					(item) => item !== value
				);
			} else {
				updatedSelectedOptions = [...prevSelectedOptions, value];
			}

			// Update the formData with the selected medicines
			setFormData((prevFormData) => ({
				...prevFormData,
				prev_medicines: updatedSelectedOptions.join(", "),
			}));

			return updatedSelectedOptions;
		});
	};

	const handleMultiSelectChangeMedicalCondition = (category, value) => {
		setSelectedOptions((prevSelectedOptions) => {
			let updatedSelectedOptions;
			if (prevSelectedOptions.includes(value)) {
				updatedSelectedOptions = prevSelectedOptions.filter(
					(item) => item !== value
				);
			} else {
				updatedSelectedOptions = [...prevSelectedOptions, value];
			}

			setFormData((prevFormData) => ({
				...prevFormData,
				past_conditions: updatedSelectedOptions.join(", "),
			}));

			return updatedSelectedOptions;
		});
	};

	const handleClearMedicines = () => {
		setSelectedMedicines([]);
		setFormData((prevFormData) => ({
			...prevFormData,
			prev_medicines: "",
		}));
	};

	const handleClearMedicalConditions = () => {
		setSelectedOptions([]);
		setFormData((prevFormData) => ({
			...prevFormData,
			past_conditions: "",
		}));
	};

	const handleOnChange = (options) => {
		setSelectedMedicines(options);
	};

	const checkAvailability = (date) => {
		const dateKey = new Date(date).toDateString();
		const event = availabilitydates.find(
			(item) => new Date(item.date).toDateString() === dateKey
		);
		return event?.is_available === "Available" ? "Available" : "";
	};

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await fetch("http://localhost:5001/api/news");
				const data = await response.json();
				setNews(data);
			} catch (error) {
				console.error("Error fetching news:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchNews();
	}, []);

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

	const fetchDoctors = async () => {
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };
		try {
			const res = await Axios.get(
				"http://localhost:5001/api/users/getDoctors",
				{
					headers,
				}
			);
			setDoctors(res.data);
		} catch (error) {
			console.error("Error fetching doctors:", error);
		}
	};

	useEffect(() => {
		if (userData.token) {
			fetchAppointments();
			fetchDoctors();
		}
	}, [userData.token]);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		}).format(date);
	};

	const formatDateForForm = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	function formatTime(time24) {
		let [hours, minutes] = time24.split(":").map(Number);
		const suffix = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		return `${hours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
	}

	const handleShowModal = (type, appointment = {}) => {
		const now = new Date();
		setFormData({
			_id: appointment._id || "",
			date: formatDateForForm(now),
			time: appointment.time || "",
			name: userData.name,
			user: userData.name,
			email: userData.email,
			status: "pending",
			doctor: "",
			prev_medicines: appointment.prev_medicines || "None",
			past_conditions: appointment.past_conditions || "None",
			reason: appointment.reason || "",
			user_id: userData.user_id,
		});
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setStep(1);
		setShowModal(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);
		try {
			const res = await Axios.post(
				"http://localhost:5001/api/appointments",
				formData,
				{ headers }
			);
			setLoading(false);
			setAppointments([...appointments, res.data]);
			toast.success("Appointment added successfully");

			handleCloseModal();
		} catch (error) {
			console.error("Error saving appointment:", error);
			toast.error("Error saving appointment");
		}
	};

	const checkScrollTop = () => {
		if (!showScroll && window.pageYOffset > 400) {
			setShowScroll(true);
		} else if (showScroll && window.pageYOffset <= 400) {
			setShowScroll(false);
		}
	};

	const scrollTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		window.addEventListener("scroll", checkScrollTop);
		return () => {
			window.removeEventListener("scroll", checkScrollTop);
		};
	}, [showScroll]);

	// const fetchDoctorsAvailability = () => {
	//   return (
	//     <div className="calendar-section">
	//       <Calendar
	//         //onChange={handleDateChange}
	//         value={date}
	//         tileContent={({ date, view }) => {
	//           if (view === "month") {
	//             const dateKey = date.toDateString();
	//             return (
	//               <div className="event-tile-content">
	//                 {events[dateKey] ? (
	//                   <Button variant="light">{events[dateKey]}</Button>
	//                 ) : (
	//                   ""
	//                 )}
	//               </div>
	//             );
	//           }
	//         }}
	//         className="custom-calendar"
	//       />
	//     </div>
	//   );
	// };

	const filteredDates = availabilitydates.filter(
		(item) => formatDateForForm(item.date) === formData.date
	);

	return (
		<div>
			{/* Hero Section */}
			<section
				id="hero"
				className="hero-section"
				style={{ position: "relative", overflow: "hidden" }}
			>
				<div
					className="hero-content"
					style={{ zIndex: 2, position: "relative" }}
				>
					<Container>
						<Row className="align-items-center">
							<Col md={6}>
								<h1>Welcome to Our Service</h1>
								<p>
									Your one-stop solution for all your needs. Discover more about
									what we offer and how we can help you.
								</p>
								<Button variant="primary" size="lg">
									Learn More
								</Button>
							</Col>
							<Col md={6}>
								<img src={Hero} alt="Hero" className="img-fluid" />
							</Col>
						</Row>
					</Container>
				</div>

				{/* Background from transparent to gradient with smooth bottom */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background:
							"linear-gradient(to bottom, transparent, rgba(0, 123, 255, 0.8), rgba(0, 123, 255, 0.1))",
						zIndex: 1,
					}}
				/>
			</section>

			{/* About Section */}
			<section id="about" className="about-section">
				<Container>
					<Row>
						<Col md={6}>
							<h2>About Us</h2>
							<p>
								Rural Health Unit Buenavista, our mission is to provide
								comprehensive and compassionate healthcare to rural communities.
								We are dedicated to improving the health and well-being of our
								residents through accessible, high-quality medical services. Our
								team of skilled professionals offers a range of services, from
								preventive care and treatment to emergency response, all
								tailored to meet the unique needs of our rural population. At
								the [Rural Health Unit Name], we are committed to fostering a
								healthier, happier community through personalized care and
								community outreach.
							</p>
						</Col>
						<Col md={6}>
							<img src={AboutHero} alt="About Us" className="img-fluid" />
						</Col>
					</Row>
				</Container>
			</section>

			{/* News and Events Section */}
			<section id="news-events" className="news-events-section">
				<Container>
					<h2>News & Events</h2>
					{loading ? (
						<p>Loading...</p>
					) : (
						<Row>
							{news.length > 0 ? (
								news.map((item) => (
									<Col md={4} key={item._id}>
										<div className="news-item" onClick={() => handleNewsItemClick(item)}>
											<img
												src={item.picture}
												alt={item.title}
												className="img-fluid"
											/>
											<h3>{item.title}</h3>
											<p>{item.article}</p>
											<small>{formatDate(item.when)}</small>
										</div>
									</Col>
								))
							) : (
								<p>No news available.</p>
							)}
						</Row>
					)}
				</Container>
			</section>

			{userData.token && (
				<section id="appointment" className="appointment-section">
					<Container>
						<h2>Appointments</h2>
						{loading ? (
							<p>Loading...</p>
						) : (
							<>
								<div className="action-button">
									<Button
										variant="primary"
										onClick={() => handleShowModal("Add")}
									>
										Add Appointment
									</Button>
								</div>
								<Table
									responsive
									className="table table-striped table-hover mt-3"
								>
									<thead>
										<tr>
											<th>ID</th>
											<th>Date</th>
											<th>Time</th>
											<th>Name</th>
											{/* <th>Doctor</th> */}
											<th>Status</th>
											<th>Reason</th>
										</tr>
									</thead>
									<tbody>
										{appointments.map((appointment, index) => (
											<tr key={appointment._id}>
												<td>{index + 1}</td>
												<td>{formatDate(appointment.date)}</td>
												<td>{formatTime(appointment.time)}</td>
												<td>{appointment.name}</td>
												{/* <td>{appointment.doctor.firstname + " " + appointment.doctor.firstname}</td> */}
												<td>{appointment.status}</td>
												<td>{appointment.reason}</td>
											</tr>
										))}
									</tbody>
								</Table>

								{/* User Modal */}
								<Modal show={showModal} onHide={handleCloseModal} size="xl">
									<Modal.Header closeButton>
										<Modal.Title>Add Appointment</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<Card className="stepper">
											<Card.Body>
												<div className="stepper-container">
													<div className={`step ${step === 1 ? "active" : ""}`}>
														<span className="step-number">1</span>
														<span className="step-label">asdfsdf Dates</span>
													</div>
													<div className="step-line"></div>
													<div className={`step ${step === 2 ? "active" : ""}`}>
														<span className="step-number">2</span>
														<span className="step-label">Client Info</span>
													</div>
												</div>
											</Card.Body>
										</Card>
										{step === 1 && (
											<div className="calendar-card">
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
												<div className="stepper-buttons">
													<Button variant="primary" onClick={handleNextStep}>
														Next
													</Button>
												</div>
											</div>
										)}

										{step === 2 && (
											<div className="p-4">
												<Form onSubmit={handleSubmit}>
													<Form.Group>
														<div className="row mb-4">
															<div className="col-md-4">
																<Form.Label>Name</Form.Label>
																<Form.Control
																	type="text"
																	value={userData.name}
																	onLoad={(e) =>
																		setFormData({
																			...formData,
																			name: e.target.value,
																		})
																	}
																	disabled
																/>
															</div>
															<div className="col-md-4">
																<Form.Label>Address</Form.Label>
																<Form.Control
																	type="text"
																	value={formData.address}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			address: e.target.value,
																		})
																	}
																	required
																/>
															</div>
															<div className="col-md-4">
																<Form.Label>Phone Number</Form.Label>
																<Form.Control
																	type="text"
																	value={formData.phone_number}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			phone_number: e.target.value,
																		})
																	}
																	required
																/>
															</div>
														</div>
													</Form.Group>
													<Form.Group>
														<div className="row mb-4">
															<div className="col-md-4">
																<Form.Label>Email</Form.Label>
																<Form.Control
																	type="email"
																	value={userData.email}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			email: e.target.value,
																		})
																	}
																	disabled
																/>
															</div>
															<div className="col-md-2">
																<Form.Label>Age</Form.Label>
																<Form.Control
																	type="number"
																	value={formData.age}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			age: e.target.value,
																		})
																	}
																	required
																/>
															</div>
															<div className="col-md-2">
																<Form.Label>Sex</Form.Label>
																<Form.Select
																	value={formData.sex}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			sex: e.target.value,
																		})
																	}
																	required
																>
																	<option value=""></option>
																	<option value="Male">Male</option>
																	<option value="Female">Female</option>
																</Form.Select>
															</div>
															<div className="col-md-2">
																<Form.Label>Height (cm)</Form.Label>
																<Form.Control
																	type="number"
																	value={formData.height}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			height: e.target.value,
																		})
																	}
																	//required
																/>
															</div>
															<div className="col-md-2">
																<Form.Label>Weight (kg)</Form.Label>
																<Form.Control
																	type="number"
																	value={formData.weight}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			weight: e.target.value,
																		})
																	}
																	//required
																/>
															</div>
														</div>
													</Form.Group>
													<Form.Group>
														<div className="row mb-4">
															<div className="col-md-3">
																<Form.Label>Civil Status</Form.Label>
																<Form.Select
																	value={formData.civil_status}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			civil_status: e.target.value,
																		})
																	}
																	required
																>
																	<option value="">Civil Status</option>
																	<option value="Single">Single</option>
																	<option value="Married">Married</option>
																	<option value="Widowed">Widowed</option>
																	<option value="Legally Separated">
																		Legally Separated
																	</option>
																</Form.Select>
															</div>
															<div className="col-md-3">
																<Form.Label>Parent/Guardian/Spouse</Form.Label>
																<Form.Control
																	type="text"
																	value={formData.guardian}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			guardian: e.target.value,
																		})
																	}
																	required
																/>
															</div>
															<div className="col-md-3">
																<Form.Label>Date</Form.Label>
																<Form.Control
																	type="date"
																	value={formData.date}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			date: e.target.value,
																		})
																	}
																	disabled
																/>
															</div>
															<div className="col-md-3">
																<Form.Label>Time</Form.Label>
																{/*<Form.Control
																type="text"
																value={formData.time}
																onChange={(e) =>
																	setFormData({
																	...formData,
																	time: e.target.value,
																	})
																}
																required
																/> */}

																<Form.Select
																	value={formData.time}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			time: e.target.value,
																		})
																	}
																	required
																>
																	<option value=""> Select Time...</option>
																	{filteredDates.map((time, index) => (
																		<option key={index} value={time.time}>
																			{formatTime(time.time)}
																		</option>
																	))}
																</Form.Select>
															</div>
														</div>
													</Form.Group>
													<Form.Group>
														<div className="row mb-4">
															<div className="col-md-4">
																<Form.Label>Medicine</Form.Label>
																<Dropdown>
																	<Dropdown.Toggle
																		id="dropdown-basic"
																		style={{
																			border: "1px solid #ced4da",
																			backgroundColor: "transparent",
																			color: "#495057",
																			width: "100%",
																			textAlign: "left",
																		}}
																		required
																	>
																		{selectedMedicines.length === 0
																			? "No Medicines Taken"
																			: selectedMedicines.join(", ")}
																	</Dropdown.Toggle>

																	<Dropdown.Menu>
																		{Medicines.map((option, index) => (
																			<Form.Check
																				key={index}
																				type="checkbox"
																				label={option.label}
																				value={option.value}
																				checked={selectedMedicines.includes(
																					option.value
																				)}
																				onChange={(e) =>
																					handleMultiSelectChangeMedicines(
																						"medicines",
																						e.target.value
																					)
																				}
																				style={{ marginLeft: "10px" }}
																			/>
																		))}
																		<Dropdown.Divider />
																		<Button
																			variant="secondary"
																			onClick={handleClearMedicines}
																			style={{
																				width: "100%",
																				marginTop: "5px",
																			}}
																		>
																			Clear Selection
																		</Button>
																	</Dropdown.Menu>
																</Dropdown>
															</div>

															<div className="col-md-4">
																<Form.Label>
																	Select Past Medical Condition
																</Form.Label>
																<Dropdown>
																	<Dropdown.Toggle
																		id="dropdown-basic"
																		style={{
																			border: "1px solid #ced4da",
																			backgroundColor: "transparent",
																			color: "#495057",
																			width: "100%",
																			textAlign: "left",
																		}}
																	>
																		{selectedOptions.length === 0
																			? "No Medical Conditions"
																			: selectedOptions.join(", ")}
																	</Dropdown.Toggle>

																	<Dropdown.Menu>
																		{PastMedicalCondition.map(
																			(option, index) => (
																				<Form.Check
																					key={index}
																					type="checkbox"
																					label={option.label}
																					value={option.value}
																					checked={selectedOptions.includes(
																						option.value
																					)}
																					onChange={(e) =>
																						handleMultiSelectChangeMedicalCondition(
																							"conditions",
																							e.target.value
																						)
																					}
																					style={{ marginLeft: "10px" }}
																				/>
																			)
																		)}
																		<Dropdown.Divider />
																		<Button
																			variant="secondary"
																			onClick={handleClearMedicalConditions}
																			style={{
																				width: "100%",
																				marginTop: "5px",
																			}}
																		>
																			Clear Selection
																		</Button>
																	</Dropdown.Menu>
																</Dropdown>
															</div>
															<div className="col-md-4">
																<Form.Label>Reason For Check Up</Form.Label>
																<Form.Select
																	value={formData.reason}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			reason: e.target.value,
																		})
																	}
																	required
																>
																	<option value=""></option>
																	<option value="Fever">Fever</option>
																	<option value="Asthma">Asthma</option>
																	<option value="Pneumonia">Pneumonia</option>
																	<option value="Allergies">Allergies</option>
																	<option value="Conjunctivits">
																		Conjunctivits
																	</option>
																	<option value="Diarrhea">Diarrhea</option>
																	<option value="Headaches">Headaches</option>
																	<option value="Mononucleosis">
																		Mononucleosis
																	</option>
																	<option value="Stomach Aches">
																		Stomach Aches
																	</option>
																</Form.Select>
															</div>
														</div>
													</Form.Group>
													{/* <Form.Group>
                            <div className="row mb-4">
                              
                               <div className="col-md-8">
                                <Form.Label>Doctor</Form.Label>
                                <Form.Select
                                  value={formData.doctor._id}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      doctor: e.target.value,
                                    })
                                  }
                                  required
                                >
                                  <option value="">Select Doctor</option>
                                  {doctors.map((doctor, index) => (
                                    <option key={index} value={doctor._id}>
                                      {doctor.firstname + " " + doctor.lastname}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div> 
                            </div>
                          </Form.Group>{" "} */}
													<Form.Group>
														<div className="row mb-4">
															<div className="col-md-12">
																<Form.Label>Additional Information</Form.Label>
																<Form.Control
																	as="textarea"
																	type="text"
																	rows={2}
																	style={{ resize: "none", width: "100%" }}
																	value={formData.additional_info}
																	onChange={(e) =>
																		setFormData({
																			...formData,
																			additional_info: e.target.value,
																		})
																	}
																	required
																/>
															</div>
														</div>
													</Form.Group>
													<div className="action-button">
														<Button
															variant="secondary"
															className="mt-3 mx-2"
															onClick={handlePrevStep}
														>
															Previous
														</Button>
														<Button
															variant="primary"
															type="submit"
															className="mt-3"
														>
															{loading ? (
																<Spinner
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
															Add Appointment
														</Button>
													</div>
												</Form>
											</div>
										)}
									</Modal.Body>
								</Modal>
							</>
						)}
					</Container>
				</section>
			)}

			{/* Footer Section */}
			<section id="contact">
				<footer id="footer" className="footer-section">
					<Container>
						<Row>
							<Col md={6}>
								<h2>Contact Us</h2>
								<p>Email: rhubuenavista@gmail.com</p>
								<p>Phone: +63 909 123 4567 </p>
							</Col>
							<Col md={6}>
								<h2>Our Address</h2>
								<p>Poblacion, Buenavista</p>
								<p>Bohol Philippines, 6333</p>
							</Col>
						</Row>
					</Container>
				</footer>
			</section>

			{/* Back to Top Button */}
			{showScroll && (
				<Button
					onClick={scrollTop}
					className="scrollTop"
					style={{
						position: "fixed",
						bottom: "50px",
						right: "30px",
						borderRadius: "50%",
						display: showScroll ? "block" : "none",
						backgroundColor: "gray",
					}}
				>
					<FaAngleDoubleUp />
				</Button>
			)}
		</div>
	);
}
