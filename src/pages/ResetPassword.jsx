import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleResetPassword(ev) {
    ev.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("❌ All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      await axios.post(`/auth/reset-password/${token}`, { password });

      alert("🎉 Password reset successful!");
      navigate("/login");
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      setMessage("❌ Password reset failed. The link may be expired or invalid.");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Reset Password</h2>

        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              required
            />
          </div>

          {message && <div className="alert alert-warning text-center">{message}</div>}

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
