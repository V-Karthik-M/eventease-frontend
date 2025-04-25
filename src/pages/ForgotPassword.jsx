import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleForgotPassword(ev) {
    ev.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5001/api/auth/forgot-password", { email });
      setMessage(data.message || "If an account exists, a reset link has been sent.");
    } catch (error) {
      setMessage("Failed to send reset email. Please try again.");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              name="email" // ✅ added for Cypress test
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </div>

          {message && <div className="alert alert-info text-center">{message}</div>}

          <button type="submit" className="btn btn-primary w-100">Submit</button>

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
