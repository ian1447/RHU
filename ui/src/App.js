import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Sidebar2 from "./components/layout/Sidebar2";
import Home from "./components/pages/Home";
import DocDashboard from "./components/pages/doctor/DoctorHome";
import DocAppointment from "./components/pages/doctor/DoctorAppointment";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { UserContext } from "./context/UserContext";
import Users from "./components/pages/user/Users";
import Appointments from "./components/pages/appointments/Appointment";
import UserAppointment from "./components/pages/appointments/UserAppointment";
import NewsEvents from "./components/pages/news&events/NewsAndEvents";
import PatientRecords from "./components/pages/patientrecords/PatientRecords";
import MessagePage from "./components/pages/message/message";
import Calendar from "./components/pages/calendar/Calendar";
import UserPatientRecord from "./components/pages/patientrecords/RecordsPerUser";
import Footer from "./components/layout/Footer";
import PublicNews from "./components/pages/news.public.js";
// import MessageContent from "./components/pages/message/MessageContent";
import { jwtDecode } from "jwt-decode";
import UserPage from "./components/pages/user_page/user_page";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

export default function App() {
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
		role: undefined,
		name: undefined,
		email: undefined,
	});
	const [loading, setLoading] = useState(true); // Added loading state

	useEffect(() => {
		const checkLoggedIn = async () => {
			let token = localStorage.getItem("auth-token");
			if (token === null) {
				localStorage.setItem("auth-token", "");
				token = "";
			}

			try {
				const tokenRes = await Axios.post(
					"http://localhost:5001/api/auth/tokenIsValid",
					{},
					{ headers: { "x-auth-token": token } }
				);

				setUserData({
					token: token,
					user: tokenRes.data.user,
					role: tokenRes.data.user.role,
					user_id: tokenRes.data.user.id,
					email: tokenRes.data.user.email,
					name: tokenRes.data.user.name,
				});
			} catch (error) {
				console.error("Authentication check failed", error);
			} finally {
				setLoading(false); // Set loading to false once check is complete
			}
		};
		checkLoggedIn();
	}, []);

	if (loading) {
		return <div>Loading...</div>; // Simple loading state
	}

	return (
		<BrowserRouter>
			<UserContext.Provider value={{ userData, setUserData }}>
				<div className="app-container">
					{/* {userData.token} Include Sidebar only if user is logged in */}
					<div className="main-content">
						<Header />
						<div className="container">
							<Switch>
								{userData.token ? (
									<>
										{userData.role === "admin" ? (
											<>
												<Sidebar />
												<Route exact path="/" component={Dashboard} />
												<Route path="/users" component={Users} />
												<Route path="/appointments" component={Appointments} />
												<Route path="/news-events" component={NewsEvents} />
												<Route
													path="/patient_records"
													component={PatientRecords}
												/>
												<Route path="/inbox" component={MessagePage} />
												<Route path="/calendar" component={Calendar} />
												{/* <Route path="/message" component={MessageContent} /> */}
												<Footer />
											</>
										) : userData.role === "user" ? (
											<>
												{/* <Sidebar2 /> */}
												<Route exact path="/" component={Home} />
												<Route path="/records" component={UserPatientRecord} />
												<Route
													path="/userappointment"
													component={UserAppointment}
												/>
												<Route path="/news" component={PublicNews} />

												<Footer />
											</>
										) : (
											<>
												<Sidebar2 />
												<Route exact path="/" component={DocDashboard} />
												<Route
													path="/doctorAvailability"
													component={DocDashboard}
												/>
												<Route
													path="/docAppointments"
													component={DocAppointment}
												/>
												<Footer />
											</>
										)}
									</>
								) : (
									<>
										<Route exact path="/" component={Home} />
										<Route path="/login" component={Login} />
										<Route path="/register" component={Register} />
									</>
								)}
							</Switch>
						</div>
					</div>
				</div>
			</UserContext.Provider>
		</BrowserRouter>
	);
}
