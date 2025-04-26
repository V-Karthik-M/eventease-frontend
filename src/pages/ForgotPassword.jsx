import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosConfig"; // ✅ Always use your configured axios

export default function ForgotPassword({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleForgotPassword(ev) {
    ev.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const { data } = await axios.post("/auth/forgot-password", { email });
      setMessage(data.message || "If an account exists, a reset link has been sent.");
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      setMessage("Failed to send reset email. Please try again later.");
    }
  }

  return (
    <div className="card p-4 shadow-lg" style={{ width: "400px", backgroundColor: "#121212", color: "white" }}>
      <h2 className="text-center mb-4">Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
        </div>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>

        <div className="text-center mt-3">
          <button type="button" onClick={() => onSwitch("login")} className="btn btn-link text-light p-0">
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
