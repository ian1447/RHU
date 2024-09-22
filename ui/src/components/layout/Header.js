import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { Navbar, Nav, Container, NavDropdown, NavItem } from "react-bootstrap";
import AuthOptions from "../auth/AuthOptions";
import { UserContext } from "../../context/UserContext";
import "./header.style.css";

export default function Header() {
	const { userData } = useContext(UserContext);

	return (
		<Navbar bg="light" expand="lg" className="p-3">
			<Container fluid>
				<Navbar.Brand as={Link} to="/" className="title">
					{userData.token ? (
						userData.role === "doctor" || userData.role === 'admin' ? (
							""
						) : (
							<>
								Welcome Back, <b>{userData.name} !</b>
							</>
						)
					) : (
						<b>RHU Buenavista</b>
					)}
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						{userData.token ? (
							userData.role === "user" ? (
								<>
									<Nav.Link href="#about" className="title">
										About Us
									</Nav.Link>
									<Nav.Link href="#news-events" className="title">
										News & Events
									</Nav.Link>
									<Nav.Link href="#appointment" className="title">
										Appointment
									</Nav.Link>
									<Nav.Link href="/records" className="title">
										Records
									</Nav.Link>
									<Nav.Link href="#contact" className="title">
										Contact Us
									</Nav.Link>
									<Nav.Link className="title">
										<AuthOptions />
									</Nav.Link>
								</>
							) : (
								<Nav.Link className="title d-flex align-items-center">
									{/* <img
										src="/img/logo.svg"
										width="30"
										height="30"
										alt="{userData.name}"
									/> */}
									<FaUser size={30} />
									<NavDropdown
										className="ms-2"
										title={userData.name}
										id="basic-nav-dropdown"
									>
										<NavDropdown.Item>
											<AuthOptions />
										</NavDropdown.Item>
									</NavDropdown>
								</Nav.Link>
							)
						) : (
							<>
								<Nav.Link href="#about" className="title">
									About Us
								</Nav.Link>
								<Nav.Link href="#news-events" className="title">
									News & Events
								</Nav.Link>
								<Nav.Link href="#contact" className="title">
									Contact Us
								</Nav.Link>
								<Nav.Link className="title">
									<AuthOptions />
								</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
