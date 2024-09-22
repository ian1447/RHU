import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Modal, Button, Form } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './calendar.styles.css'; // Custom CSS for calendar styling

const EventModal = ({ show, handleClose, date, addEvent }) => {
  const [event, setEvent] = useState('');

  const handleSubmit = () => {
    if (event) {
      addEvent(date, event);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="eventInput">
          <Form.Label>Event</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const addEvent = (date, event) => {
    const dateKey = date.toDateString();
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateKey]: [...(prevEvents[dateKey] || []), { title: event, date: date.toDateString() }],
    }));
  };

  const getEventsForDate = (date) => {
    return events[date.toDateString()] || [];
  };

  return (
    <div className="container mx-4 p-4">
      <h2>Interactive Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const dateKey = date.toDateString();
            const eventList = getEventsForDate(date);
            return (
              <div className="event-tile-content">
                {eventList.map((event, index) => (
                  <div key={index} className="event-item">
                    {event.title}
                  </div>
                ))}
              </div>
            );
          }
        }}
        className="custom-calendar"
      />
      <div className="mt-3">
        <h4 style={{color: 'gray'}}>List of upcoming events</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {getEventsForDate(date).map((event, index) => (
              <tr key={index}>
                <td>{event.title}</td>
                <td>{event.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EventModal
        show={showModal}
        handleClose={handleClose}
        date={date}
        addEvent={addEvent}
      />
    </div>
  );
};

export default CalendarComponent;
