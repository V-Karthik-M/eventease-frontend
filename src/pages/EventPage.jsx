import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsapp, FaFacebook } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching event:", err.response || err.message);
        setError("Error fetching event. Please try again.");
        setLoading(false);
      });

    axios
      .get("http://localhost:5001/api/events")
      .then((res) => {
        setRelatedEvents(res.data.filter((e) => e._id !== id));
      })
      .catch((err) => console.error("❌ Error fetching related events:", err));
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 Event link copied to clipboard!");
  };

  const handleBookTicket = () => {
    if (event?.ticketPrice === 0) {
      navigate(`/book/${event._id}`);
    } else {
      navigate("/payment", { state: { event } });
    }
  };

  if (loading) return <div className="text-center mt-5 fw-semibold">Loading event details...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
  if (!event) return <div className="text-center mt-5">Event not found.</div>;

  return (
    <div className="page-content container">
      {/* 🔙 Back Button */}
      <div className="mb-4">
        <img
          src="/back-button.png"
          alt="Back"
          className="img-fluid"
          style={{ width: "40px", cursor: "pointer" }}
          onClick={() => navigate("/upcoming-events")}
        />
      </div>

      <div className="row">
        <div className="col-lg-8 mb-5">
          <div className="glass-card p-4 rounded-4 shadow-lg">
            {event.image && (
              <img
                src={`http://localhost:5001/${event.image}`}
                alt="Event"
                className="img-fluid rounded-4 mb-4 w-100"
                style={{ maxHeight: "450px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-user.png";
                }}
              />
            )}

            <h1 className="fw-bold mb-3 display-5 text-primary-gradient">{event.title}</h1>
            <p className="lead text-secondary mb-4">{event.description}</p>
            <h5 className="mb-3"><strong>Organized By:</strong> {event.organizedBy}</h5>

            <div className="d-flex flex-wrap gap-4 mb-3">
              <span className="d-flex align-items-center gap-2 text-muted">
                <AiFillCalendar /> {event.eventDate?.split("T")[0]} | {event.eventTime}
              </span>
              <span className="d-flex align-items-center gap-2 text-muted">
                <MdLocationPin /> {event.location}
              </span>
            </div>

            <h5 className="mb-3">
              <strong>Ticket Price:</strong> {event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice}`}
            </h5>

            <button
              onClick={handleBookTicket}
              className="event-book-btn btn btn-lg px-5"
            >
              Book Ticket
            </button>

            <div className="mt-5">
              <h5 className="mb-3">Share Event:</h5>
              <div className="share-buttons">
                <button className="share-btn copy" onClick={handleCopyLink}>
                  <FaCopy /> Copy Link
                </button>
                <button
                  className="share-btn whatsapp"
                  onClick={() =>
                    window.open(`https://wa.me/?text=${window.location.href}`, "_blank")
                  }
                >
                  <FaWhatsapp /> WhatsApp
                </button>
                <button
                  className="share-btn facebook"
                  onClick={() =>
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")
                  }
                >
                  <FaFacebook /> Facebook
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "100px" }}>
            <h4 className="mb-3">More Events</h4>
            <div className="list-group rounded-3 shadow-sm">
              {relatedEvents.length > 0 ? (
                relatedEvents.map((relEvent) => (
                  <Link
                    key={relEvent._id}
                    to={`/event/${relEvent._id}`}
                    className="list-group-item list-group-item-action py-3"
                  >
                    <strong>{relEvent.title}</strong><br />
                    <small><AiFillCalendar /> {relEvent.eventDate.split("T")[0]}</small>
                  </Link>
                ))
              ) : (
                <p className="text-muted">No other events available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
