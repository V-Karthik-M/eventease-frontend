import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaUpload,
  FaUserAlt,
  FaHeading,
  FaAlignLeft,
} from "react-icons/fa";

export default function AddEvent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    owner: user ? user.name : "",
    title: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (imageFile) data.append("image", imageFile);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("🎉 Event created successfully!");
      console.log("Event response:", response.data);
      setTimeout(() => navigate("/upcoming-events"), 1500);
    } catch (error) {
      console.error("❌ Error uploading event:", error);
      setError(error.response?.data?.error || "Error creating event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content container" data-aos="fade-up">
      {/* 🔙 Back Button */}
      <div className="mb-3">
        <img
          src="/back-button.png"
          alt="Back"
          style={{ width: "50px", cursor: "pointer" }}
          onClick={() => navigate("/upcoming-events")}
        />
      </div>

      <div className="form-wrapper animate__animated animate__fadeIn">
        <h2 className="mb-4 text-center">🎤 Schedule an Event</h2>

        {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="card p-4" encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label"><FaHeading /> Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><FaAlignLeft /> Description</label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Event Description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label"><FaUserAlt /> Organized By</label>
            <input
              type="text"
              name="organizedBy"
              className="form-control"
              placeholder="Organizer's Name"
              value={formData.organizedBy}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label"><FaCalendarAlt /> Date</label>
              <input
                type="date"
                name="eventDate"
                className="form-control"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label"><FaClock /> Time</label>
              <input
                type="time"
                name="eventTime"
                className="form-control"
                value={formData.eventTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label"><FaMapMarkerAlt /> Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="Event Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><FaTag /> Ticket Price</label>
            <input
              type="number"
              name="ticketPrice"
              className="form-control"
              placeholder="Ticket Price in $"
              value={formData.ticketPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label"><FaUpload /> Upload Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
            {imageFile && (
              <p className="mt-2 small text-muted">
                Selected: <strong>{imageFile.name}</strong>
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
