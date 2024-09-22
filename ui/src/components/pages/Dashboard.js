import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Line } from "react-chartjs-2";
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
import { UserContext } from "../../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function Dashboard() {
	const { userData } = useContext(UserContext);
	const [appointments, setAppointments] = useState([]);
	const [clientData, setClientData] = useState([]);

	useEffect(() => {
		if (userData) {
			console.log("User Data:", userData);
		} else {
			console.log("You need to login to this website to access.");
		}
	}, [userData]);

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

	useEffect(() => {
		if (appointments.length > 0) {
			// Aggregate data by month
			const monthlyData = Array(12).fill(0); // Initialize an array of 12 zeros for each month
			appointments.forEach((appointment) => {
				const month = new Date(appointment.date).getMonth(); // Get the month (0-11)
				monthlyData[month] += 1; // Increment the count for that month
			});
			setClientData(monthlyData.slice(0, new Date().getMonth() + 1)); // Only keep data up to the current month
		}
	}, [appointments]);

	// Generate dynamic labels from January to the current month
	const currentMonth = new Date().getMonth();
	const monthLabels = Array.from({ length: currentMonth + 1 }, (_, i) =>
		new Date(0, i).toLocaleString("default", { month: "long" })
	);

	const data = {
		labels: [
			"Cough",
			"Fever",
			"Headache",
			"Stomache",
			"Diziness",
			"Ulcer",
			"Gastritis",
		],
		datasets: [
			{
				label: "Common Diseases",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40],
			},
		],
	};

	const data2 = {
		labels: monthLabels,
		datasets: [
			{
				label: "Client Numbers",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: clientData,
			},
		],
	};

	return (
		<div className="page">
			<>
				<h3>
					{userData.role === "doctor" ? (
						<>
							Welcome Back, Dr. <b>{userData.name} !</b>
						</>
					) : (
						<>
							Welcome Back, <b>{userData.name} !</b>
						</>
					)}
				</h3>

				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">Common Diseases</h5>
									<Line data={data} />
								</div>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">Client Numbers</h5>
									<Line data={data2} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		</div>
	);
}
