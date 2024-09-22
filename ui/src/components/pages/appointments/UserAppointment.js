import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { FaPen, FaTrash, FaCheck, FaWindowClose } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Bootstrap from "react-bootstrap";
import { UserContext } from "../../../context/UserContext";

const UserAppointment = () => {
  const { userData } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [modalType, setModalType] = useState("Add"); // 'Add' or 'Edit'
  const [formData, setFormData] = useState({
    _id: "",
    date: "",
    time: "",
    name: "",
    user: "",
    status: "pending",
    doctor: "",
    reason: "",
    user_id: userData.user_id,
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
        //console.log("Fetched appointments:", res.data); // Log the fetched data
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();

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
        //console.log("Fetched Doctors:", res.data); // Log the fetched data
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleShowModal = (type, appointment = {}) => {
    setModalType(type);
    setFormData({
      _id: appointment._id || "",
      date: appointment.date || "",
      time: appointment.time || "",
      name: appointment.name || "",
      user: appointment.name || "",
      status: "pending",
      doctor: "",
      reason: appointment.reason || "",
      user_id: userData.user_id,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth-token");
    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);
    try {
      if (modalType === "Add") {
        const res = await Axios.post(
          "http://localhost:5001/api/appointments",
          formData,
          { headers }
        );
        setLoading(false);
        setAppointments([...appointments, res.data]);
        toast.success("Appointment added successfully");
      } else {
        const { password, ...updateData } = formData; // Exclude password from update data
        const res = await Axios.put(
          `http://localhost:5001/api/appointments/${formData._id}`,
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
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("Error saving appointment");
    }
  };

  const handleShowDeleteModal = (id) => {
    setAppointmentIdToDelete(id); // Set the user ID to delete
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
        `http://localhost:5001/api/appointment/${appointmentIdToDelete}`,
        {
          headers,
        }
      );
      setLoading(false);
      setAppointments(
        appointments.filter(
          (appointments) => appointments._id !== appointmentIdToDelete
        )
      );
      toast.success("Appointment deleted successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error deleting Appointment:", error);
      toast.error("Error deleting Appointment");
    } finally {
      handleCloseDeleteModal(); // Close the confirmation modal after deletion
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
      <h4>Appointments</h4>
      <div className="action-button">
        <Bootstrap.Button
          variant="primary"
          onClick={() => handleShowModal("Add")}
        >
          Add Appointment
        </Bootstrap.Button>
      </div>
      <Bootstrap.Table
        responsive
        className="table table-striped table-hover mt-3"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Name</th>
            <th>Doctor</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment._id}>
              <td>{index + 1}</td>
              <td>{formatDate(appointment.date)}</td>
              <td>{formatTime(appointment.time)}</td>
              <td>{appointment.name}</td>
              <td>
                {appointment.doctor.firstname +
                  " " +
                  appointment.doctor.firstname}
              </td>
              <td>{appointment.status}</td>
              <td>{appointment.reason}</td>
              {/* <td>
                <FaCheck
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    color: "blue",
                  }}
                  onClick={() => handleShowModal("Edit", appointment)}
                />
                <FaWindowClose
                  style={{ cursor: "pointer", color: "red", paddingLeft: 2 }}
                  onClick={() => handleShowDeleteModal(appointment._id)} // Open delete confirmation modal
                />
              </td> */}
            </tr>
          ))}
        </tbody>
      </Bootstrap.Table>

      {/* User Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reason</Form.Label>
              <Form.Control
                type="text"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                value={formData.doctor._id}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
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
            </Form.Group>
            <div className="action-button">
              <Button variant="primary" type="submit" className="mt-3">
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
                {modalType === "Add" ? "Add Appointment" : "Update Appointment"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
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

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default UserAppointment;
