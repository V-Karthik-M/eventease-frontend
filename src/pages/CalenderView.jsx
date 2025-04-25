import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetails, setEventDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEventDetails(null);
  };

  const getEventsOnDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return events.filter(
      (event) => event.eventDate.split("T")[0] === formattedDate
    );
  };

  const handleEventClick = (eventId) => {
    const selectedEvent = events.find((event) => event._id === eventId);
    if (selectedEvent) {
      setEventDetails(selectedEvent);
    }
  };

  return (
    <div className="page-content container">
      {/* Optional Back Button */}
      <div className="mb-3">
        <img
          src="http://localhost:5001/uploads/Back_button.png"
          alt="Back"
          style={{ width: "50px", cursor: "pointer" }}
          onClick={() => navigate("/upcoming-events")}
        />
      </div>

      <h2 className="mb-4">📅 Event Calendar</h2>

      <div className="row">
        {/* Calendar Section */}
        <div className="col-md-5 mb-4">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileClassName={({ date }) =>
              getEventsOnDate(date).length > 0 ? "highlight" : null
            }
          />
        </div>

        {/* Event Details */}
        <div className="col-md-7 mb-4">
          {eventDetails ? (
            <div className="card p-3 shadow-sm">
              <h4>{eventDetails.title}</h4>
              <p>{eventDetails.description}</p>
              <p><strong>Organized By:</strong> {eventDetails.organizedBy}</p>
              <p><strong>Location:</strong> {eventDetails.location}</p>
              <p><strong>Date:</strong> {eventDetails.eventDate.split("T")[0]}</p>
              <button
                onClick={() => navigate(`/event/${eventDetails._id}`)}
                className="btn btn-primary mt-2"
              >
                View Full Details
              </button>
            </div>
          ) : (
            <p className="text-muted">Select a date to view event details.</p>
          )}
        </div>
      </div>

      {/* List of Events on Selected Date */}
      <div className="mt-4">
        <h4 className="mb-3">
          Events on <span className="text-primary">{selectedDate.toDateString()}</span>
        </h4>
        {getEventsOnDate(selectedDate).length > 0 ? (
          getEventsOnDate(selectedDate).map((event) => (
            <div
              key={event._id}
              className="card mb-3 p-3 shadow-sm"
              onClick={() => handleEventClick(event._id)}
              style={{ cursor: "pointer" }}
            >
              <h5 className="mb-1">{event.title}</h5>
              <p className="mb-0">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No events scheduled for this date.</p>
        )}
      </div>
    </div>
  );
}
