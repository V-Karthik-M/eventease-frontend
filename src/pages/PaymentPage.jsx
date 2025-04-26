import { loadStripe } from "@stripe/stripe-js";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import UserContext from "../UserContext";

// ✅ Stripe publishable key
const stripePromise = loadStripe("pk_test_51REClz04YfwG7T1BOgToWaXczQlj4zQ4zPBqpT94aSco0A5pl3LTiOgdfRMGdGwxNzqFEmDb1LM3WVkKgUjb27gT003dCbVSgR");

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(UserContext);

  const [event, setEvent] = useState(null);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendees, setAttendees] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate("/upcoming-events");
      return;
    }

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => {
        alert("❌ Event not found!");
        navigate("/upcoming-events");
      });
  }, [id, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError(null);

    if (!attendeeName.trim() || attendees < 1) {
      setError("Please enter your name and at least 1 attendee.");
      return;
    }

    const bookingData = {
      eventId: event._id,
      amount: event.ticketPrice * attendees,
      attendees,
      attendeeName,
    };

    localStorage.setItem("bookingEvent", JSON.stringify(bookingData));
    localStorage.setItem("bookingCreated", "false");

    if (event.ticketPrice === 0) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookings/create`, bookingData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 201) {
          alert("✅ Free ticket booked successfully!");
          navigate("/useraccount");
        }
      } catch (err) {
        console.error("❌ Booking failed:", err?.response?.data || err.message);
        setError("Failed to book ticket. Please try again.");
      }
    } else {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/payment/create-checkout-session`,
          {
            eventId: event._id,
            eventName: event.title,
            price: event.ticketPrice,
            quantity: attendees,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const url = res.data?.url;
        if (url) {
          window.location.href = url;
        } else {
          setError("Stripe checkout URL not received. Please try again.");
        }
      } catch (err) {
        console.error("❌ Stripe session error:", err?.response?.data || err.message);
        setError("Stripe redirection failed. Please try again.");
      }
    }
  };

  if (!event) {
    return <div className="text-center mt-5">Loading event details...</div>;
  }

  return (
    <div className="page-content container mt-5">
      {/* 🔙 Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/upcoming-events")}
          className="btn btn-outline-secondary d-inline-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          Back to Events
        </button>
      </div>

      {/* Page Title */}
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6 text-primary mb-3">Book Your Spot</h2>
        <p className="text-muted">Secure your ticket now and be part of this exciting experience!</p>
      </div>

      {/* Event Summary */}
      <div className="mb-4 bg-white rounded shadow-sm p-4">
        <h4 className="fw-semibold text-dark mb-2">{event.title}</h4>
        <p className="mb-1"><strong>Price:</strong> {event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice}`}</p>
        <p className="mb-0"><strong>Date:</strong> {event.eventDate?.split("T")[0]}</p>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleBooking} className="card p-4 shadow-sm border-0 rounded-4 bg-light">
        <div className="mb-3">
          <label className="form-label fw-semibold">Your Name</label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={attendeeName}
            onChange={(e) => setAttendeeName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Number of Attendees</label>
          <input
            type="number"
            className="form-control form-control-lg"
            min={1}
            value={attendees}
            onChange={(e) => setAttendees(Number(e.target.value))}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill mt-3">
          {event.ticketPrice === 0 ? "Book Free Ticket" : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}
