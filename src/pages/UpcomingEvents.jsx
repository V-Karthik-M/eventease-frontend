import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import UserContext from "../UserContext";

export default function UpcomingEvents() {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events`);

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const upcoming = res.data.filter((event) => {
          const eventDate = new Date(event.eventDate);
          return eventDate >= today;
        });

        setEvents(upcoming);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        setError("Error fetching upcoming events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  return (
    <div className="page-content container">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="display-5 fw-semibold text-dark">Upcoming Events</h1>
        {user && (
          <Link
            to="/useraccount"
            className="d-flex align-items-center text-dark text-decoration-none"
          >
            <img
              src={user.image ? `/${user.image}` : "/user_icon.png"}
              alt="User"
              className="rounded-circle me-2"
              width="40"
              height="40"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/user_icon.png";
              }}
            />
            <FaUser className="me-1 text-dark" />
            <span className="fw-semibold">{user.name || "User"}</span>
          </Link>
        )}
      </div>

      {loading && <p className="text-center">Loading events...</p>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="col-md-4 mb-4">
              <div className="card event-card shadow-sm border-0 d-flex flex-column h-100">
                {event.image && (
                  <img
                    src={`https://eventease-backend-s4ih.onrender.com/${event.image}`}
                    alt={event.title}
                    className="card-img-top"
                  />
                )}
                <div className="card-body d-flex flex-column px-4 py-3">
                  <h5 className="fw-semibold">{event.title}</h5>
                  <p className="text-muted small mb-2">
                    {event.description?.substring(0, 100)}...
                  </p>
                  <p className="text-muted small d-flex align-items-center mb-3">
                    <AiFillCalendar className="me-1" />{" "}
                    {event.eventDate?.split("T")[0]} &nbsp;|&nbsp;
                    <MdLocationPin className="ms-1 me-1" /> {event.location}
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={`/event/${event._id}`}
                      className="btn w-100 rounded-pill px-4 py-2 fw-medium event-btn"
                      data-testid={`view-${event.title}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center">No upcoming events.</p>
        )}
      </div>
    </div>
  );
}
