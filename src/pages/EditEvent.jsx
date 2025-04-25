import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    image: "", 
  });

  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/events/${id}`) // ✅ Dynamic URL
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching event details.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const updatedData = new FormData();

      for (const key in formData) {
        if (key !== "image") {
          updatedData.append(key, formData[key]);
        }
      }

      if (newImageFile) {
        updatedData.append("image", newImageFile);
      }

      await axios.put(`/events/${id}`, updatedData, { // ✅ Dynamic URL
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Event updated successfully!");
      setTimeout(() => navigate("/useraccount"), 1500);
    } catch (err) {
      setError("❌ Error updating event. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading event details...</p>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="page-content container">
      <div className="mb-4">
        <img
          src="/back-button.png"
          alt="Back"
          style={{ width: "50px", cursor: "pointer" }}
          onClick={() => navigate("/useraccount")}
        />
      </div>

      <h2 className="text-center fw-semibold mb-4">Edit Event</h2>

      {message && <div className="alert alert-success text-center fw-semibold">{message}</div>}
      {error && <div className="alert alert-danger text-center fw-semibold">{error}</div>}

      <form onSubmit={handleSubmit} className="form-wrapper card p-4 shadow-sm" encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Organized By</label>
          <input
            type="text"
            name="organizedBy"
            className="form-control"
            value={formData.organizedBy}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Event Date</label>
            <input
              type="date"
              name="eventDate"
              className="form-control"
              value={formData.eventDate?.split("T")[0]}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Event Time</label>
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
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ticket Price</label>
          <input
            type="number"
            name="ticketPrice"
            className="form-control"
            value={formData.ticketPrice}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Preview */}
        {formData.image && !newImageFile && (
          <div className="mb-4">
            <label className="form-label">Current Image</label>
            <img
              src={`/${formData.image}`} // ✅ Dynamic Image
              alt="Current"
              className="img-fluid rounded mb-2"
              style={{ maxHeight: "200px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-user.png";
              }}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="form-label">Upload New Image (Optional)</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {newImageFile && (
            <p className="mt-2 small text-muted">
              Selected: <strong>{newImageFile.name}</strong>
            </p>
          )}
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button type="submit" className="btn btn-success px-4">Save Changes</button>
          <button type="button" className="btn btn-secondary px-4" onClick={() => navigate("/useraccount")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
