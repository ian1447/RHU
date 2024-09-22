import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Axios from "axios";
import {
	Form,
	Button,
	Container,
	Row,
	Col,
	Alert,
	Card,
} from "react-bootstrap";

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [error, setError] = useState("");

	const { setUserData } = useContext(UserContext);
	const history = useHistory();

	const submit = async (e) => {
		e.preventDefault();
		try {
			const newUser = { email, password, passwordCheck, displayName };
			await Axios.post("http://localhost:5001/api/auth/signup", newUser);

			const loginRes = await Axios.post(
				"http://localhost:5001/api/auth/login",
				{
					email,
					password,
				}
			);

			setUserData({
				token: loginRes.data.token,
				user: loginRes.data.user,
			});

			localStorage.setItem("auth-token", loginRes.data.token);
			history.push("/");
		} catch (err) {
			if (err.response && err.response.data.err) {
				setError(err.response.data.err);
			}
		}
	};

	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ height: "100vh" }}
		>
			<Row className="w-100">
				<Col md={6} className="mx-auto">
					<Card>
						<Card.Body>
							<h2 className="text-center mb-4">Register</h2>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form onSubmit={submit}>
								<Form.Group controlId="register-email" className="mb-2">
									<Form.Label>Email</Form.Label>
									<Form.Control
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
										required
									/>
								</Form.Group>

								<Form.Group controlId="register-password" className="mb-2">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										required
									/>
								</Form.Group>

								<Form.Group controlId="register-password-check" className="mb-2">
									<Form.Control
										type="password"
										value={passwordCheck}
										onChange={(e) => setPasswordCheck(e.target.value)}
										placeholder="Verify password"
										required
									/>
								</Form.Group>

								<Form.Group controlId="register-display-name">
									<Form.Label>Display Name</Form.Label>
									<Form.Control
										type="text"
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										placeholder="Enter your display name"
										required
									/>
								</Form.Group>

								<div className="mt-4">
									<Button type="submit" variant="primary" className="w-100" block>
										Register
									</Button>
								</div>
							</Form>

							<div className="text-center mt-3">
								<Button
									variant="link"
									block
									onClick={() => history.push("/login")}
								>
									Already have an account? Log in here.
								</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
