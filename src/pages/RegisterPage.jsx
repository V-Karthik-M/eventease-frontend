import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function validateForm() {
    if (name.length < 3) {
      setErrorMessage("❌ Name should contain at least 3 letters.");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("❌ Enter a valid email address.");
      return false;
    }
    if (password.length < 8 || !/[A-Z]/.test(password)) {
      setErrorMessage("❌ Password must be at least 8 characters and have one uppercase letter.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("❌ Passwords do not match!");
      return false;
    }
    return true;
  }

  async function registerUser(ev) {
    ev.preventDefault();
    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        `/auth/register`, // ✅ Correct (not /api/auth/register anymore)
        { name, email, password }
      );

      alert("🎉 Registration Successful!");
      if (onSuccess) onSuccess();
      setRedirect(true);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(`❌ ${error.response.data.message}`);
      } else {
        setErrorMessage("❌ Registration failed. Please try again.");
      }
    }
  }

  if (redirect) return <Navigate to="/login" />;

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div
        className="card p-4 shadow-lg rounded"
        style={{ width: "400px", backgroundColor: "#121212", color: "white" }}
      >
        <h2 className="text-center mb-4">Create Account</h2>

        {errorMessage && (
          <div className="alert alert-danger text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={registerUser}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
              style={{ backgroundColor: "#1e1e1e", color: "white", border: "1px solid #555" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              style={{ backgroundColor: "#1e1e1e", color: "white", border: "1px solid #555" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter a strong password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              style={{ backgroundColor: "#1e1e1e", color: "white", border: "1px solid #555" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              required
              style={{ backgroundColor: "#1e1e1e", color: "white", border: "1px solid #555" }}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create Account
          </button>

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none text-light">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
