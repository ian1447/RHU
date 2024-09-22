import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import './style.css';

const UserPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <Container>
            <Row className="align-items-center">
              <Col md={8}>
                <h1>Welcome to Our Service</h1>
                <p>Your one-stop solution for all your needs. Discover more about what we offer and how we can help you.</p>
              </Col>
              <Col md={6}>
                {/* <img src={Hero} alt="Hero" className="img-fluid" /> */}
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <Container>
          <Row>
            <Col md={8}>
              <h2>About Us</h2>
              <p>
                We are committed to providing exceptional service and innovative solutions tailored to your needs. Our team of experts works
                tirelessly to ensure that you receive the best experience possible.
              </p>
            </Col>
            <Col md={6}>
              {/* <img src={AboutHero} alt="About Us" className="img-fluid" /> */}
            </Col>
          </Row>
        </Container>
      </section>

      {/* News and Events Section */}
      <section id="news-events" className="news-events-section">
        <Container>
          <h2>News & Events</h2>
          <Row>
            <Col md={4}>
              <div className="news-item">
                <h3>Latest News Title</h3>
                <p>Brief description of the latest news or event. Stay tuned for more updates.</p>
                <Button variant="link">Read More</Button>
              </div>
            </Col>
            <Col md={4}>
              <div className="news-item">
                <h3>Upcoming Event Title</h3>
                <p>Details about an upcoming event. Join us and be part of the excitement!</p>
                <Button variant="link">Learn More</Button>
              </div>
            </Col>
            <Col md={4}>
              <div className="news-item">
                <h3>Another News Title</h3>
                <p>Additional news or updates. Keep yourself informed about what's happening.</p>
                <Button variant="link">Read More</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <footer id="footer" className="footer-section">
        <Container>
          <Row>
            <Col md={6}>
              <h2>Contact Us</h2>
              <p>Email: info@example.com</p>
              <p>Phone: +123 456 7890</p>
            </Col>
            <Col md={6}>
              <h2>Our Address</h2>
              <p>123 Business Rd.</p>
              <p>Business City, BC 12345</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default UserPage;
