import { useEffect, useState, useContext } from "react";
import axios from "../axiosConfig"; // ✅ Use your configured axios
import { Link, useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { FaArrowLeft } from "react-icons/fa";
import UserContext from "../UserContext";

const getImageUrl = (path) => {
  if (!path) return "/default-user.png";
  return path.startsWith("uploads/")
    ? `${import.meta.env.VITE_BACKEND_URL.replace("/api", "")}/${path}`
    : `${import.meta.env.VITE_BACKEND_URL.replace("/api", "")}/uploads/${path}`;
};

export default function UserContent() {
  const { user, setUser, token } = useContext(UserContext);
  const [userEvents, setUserEvents] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    axios.get("/events")
      .then(res => {
        const created = res.data.filter(event => event.owner === user.name);
        setUserEvents(created);
      })
      .catch(err => console.error("❌ Error loading events:", err));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    axios.get(`/events/analytics/${user.name}`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error("❌ Error loading analytics:", err));
  }, [user]);

  useEffect(() => {
    if (!user || !token) return;

    const bookingEvent = JSON.parse(localStorage.getItem("bookingEvent"));
    const bookingCreated = localStorage.getItem("bookingCreated");

    const createBookingIfNeeded = async () => {
      if (
        location.search.includes("payment=success") &&
        bookingEvent?.eventId &&
        bookingCreated !== "true"
      ) {
        try {
          const res = await axios.post(
            "/bookings/create",
            {
              eventId: bookingEvent.eventId,
              amount: bookingEvent.amount,
              attendees: bookingEvent.attendees || 1,
              attendeeName: bookingEvent.attendeeName || user.name,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.status === 201) {
            alert("🎉 Payment successful! Booking confirmed.");
            localStorage.setItem("bookingCreated", "true");
            localStorage.removeItem("bookingEvent");
            navigate("/useraccount", { replace: true });
          }
        } catch (err) {
          console.error("❌ Booking creation error:", err);
          localStorage.setItem("bookingCreated", "true");
        }
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axios.get("/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const unique = new Map();
        const deduplicated = res.data.filter((b) => {
          const key = b.eventId?._id;
          if (!key || unique.has(key)) return false;
          unique.set(key, true);
          return true;
        });

        setMyBookings(deduplicated);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err?.response?.data || err.message);
      }
    };

    createBookingIfNeeded().then(fetchBookings);
  }, [user, token, location.search]);

  const handleCancelBooking = async (bookingId) => {
    if (!token) return;
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axios.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("✅ Booking cancelled.");
    } catch (err) {
      alert("❌ Failed to cancel booking.");
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`/events/${eventId}`);
      setUserEvents((prev) => prev.filter((e) => e._id !== eventId));
      alert("✅ Event deleted.");
    } catch (err) {
      alert("❌ Failed to delete event.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    axios.post("/auth/logout").then(() => navigate("/"));
  };

  if (!user) return <p className="text-center mt-5">Please log in to view your account.</p>;

  return (
    <div className="container mt-4 animate-fade-in">
      <div className="mb-4">
        <button
          onClick={() => navigate("/upcoming-events")}
          className="btn btn-outline-secondary d-inline-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back to Events
        </button>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <h2 className="mb-3 mb-md-0 fw-semibold">👤 {user.name}'s Dashboard</h2>
        <Link to="/addevent" className="btn btn-outline-primary btn-lg shadow-sm">
          + Create Event
        </Link>
      </div>

      <button className="btn btn-outline-danger mb-4" onClick={handleLogout}>
        🚪 Logout
      </button>

      <h4 className="mt-4 fw-bold">🎪 Your Events</h4>
      {userEvents.length === 0 ? (
        <p className="text-muted fst-italic">No events created yet.</p>
      ) : (
        <div className="row">
          {userEvents.map((event) => (
            <div key={event._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg">
                {event.image && (
                  <img
                    src={getImageUrl(event.image)}
                    alt={event.title}
                    className="card-img-top"
                    style={{ maxHeight: "280px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="fw-semibold">{event.title}</h5>
                  <p>{event.description.substring(0, 100)}...</p>
                </div>
                <div className="card-footer d-flex justify-content-between gap-2">
                  <Link to={`/event/${event._id}`} className="btn btn-sm btn-outline-primary w-100">View</Link>
                  <button className="btn btn-sm btn-warning w-100" onClick={() => navigate(`/edit-event/${event._id}`)}>Edit</button>
                  <button className="btn btn-sm btn-danger w-100" onClick={() => handleDelete(event._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h4 className="mt-5 fw-bold">📊 Event Analytics</h4>
      {analytics.length === 0 ? (
        <p className="text-muted fst-italic">No analytics data available.</p>
      ) : (
        <div className="row">
          {analytics.map((a) => (
            <div key={a.eventId} className="col-md-4 mb-4">
              <div className="card border-info shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">{a.title}</h5>
                  <p className="mb-1">👥 RSVPs: <strong>{a.rsvpCount}</strong></p>
                  <p className="mb-1">💰 Revenue: <strong>${a.totalRevenue}</strong></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h4 className="mt-5 fw-bold">🎟️ Your Bookings</h4>
      {myBookings.length === 0 ? (
        <p className="text-muted fst-italic">You haven’t booked any events yet.</p>
      ) : (
        <div className="row">
          {myBookings.map((booking) => (
            <div key={booking._id} className="col-md-4 mb-4">
              <div className="card h-100 border-success shadow">
                {booking.eventId?.image && (
                  <img
                    src={getImageUrl(booking.eventId.image)}
                    alt={booking.eventId.title}
                    className="card-img-top"
                    style={{ maxHeight: "260px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="fw-semibold">{booking.eventId?.title}</h5>
                  <p><strong>Name:</strong> {booking.attendeeName}</p>
                  <p><strong>People:</strong> {booking.attendees}</p>
                  <p><strong>Paid:</strong> ${booking.amount}</p>
                  <p className="text-muted">Booked on: {new Date(booking.timestamp).toLocaleString()}</p>
                  <div className="text-center mt-3">
                    <QRCodeCanvas
                      value={`BookingID:${booking._id}`}
                      size={128}
                      level="H"
                      includeMargin
                    />
                    <p className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
                      Scan at event check-in
                    </p>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <Link to={`/event/${booking.eventId?._id}`} className="btn btn-outline-success btn-sm">View Event</Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelBooking(booking._id)}>Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
