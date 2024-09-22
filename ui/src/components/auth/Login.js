import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUserData,userData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };
      const loginRes = await Axios.post(
        "http://localhost:5001/api/auth/login",
        loginUser
      );

      //console.log("$$user", loginRes);
      // Decode the token to get user data
      const decodedToken = jwtDecode(loginRes.data.token);

      // Extract user data from the decoded token
      const user = decodedToken.user;

      setUserData({
        token: loginRes.data.token,
        user,
        role: loginRes.data.user.role,
        user_id: loginRes.data.user.id,
        email: loginRes.data.user.email,
        name: loginRes.data.user.name,
      });

      // Store the token and user data in local storage
      localStorage.setItem("auth-token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(user));

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
              <h2 className="text-center mb-4">Log in</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={submit}>
                <Form.Group controlId="login-email" className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="login-password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>

                <div className="mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    block
                  >
                    Log in
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <Button variant="link" href="/register">
                  No account yet? Register here.
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
