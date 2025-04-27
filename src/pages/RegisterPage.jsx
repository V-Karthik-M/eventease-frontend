import { useState } from "react";
import axios from "../axiosConfig"; // ✅ Using configured axios

export default function RegisterPage({ onSuccess, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setErrorMessage("❌ Password must be at least 8 characters long and have one uppercase letter.");
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
      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("🎉 Registration Successful!");
      if (onSuccess) onSuccess();
      // 🚫 No redirect here. Homepage will handle navigation after popup closes.
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(`❌ ${error.response.data.message}`);
      } else {
        setErrorMessage("❌ Registration failed. Please try again.");
      }
    }
  }

  return (
    <div
      className="card p-4 shadow-lg rounded"
      style={{ width: "400px", backgroundColor: "#121212", color: "white" }}
    >
      <h2 className="text-center mb-4">Create Account</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <form onSubmit={registerUser}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name" // 🔥 Updated for Cypress
            className="form-control"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            required
            style={{
              backgroundColor: "#1e1e1e",
              color: "white",
              border: "1px solid #555",
            }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email" // ✅ Already correct
            className="form-control"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
            style={{
              backgroundColor: "#1e1e1e",
              color: "white",
              border: "1px solid #555",
            }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password" // 🔥 Updated for Cypress
            className="form-control"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
            style={{
              backgroundColor: "#1e1e1e",
              color: "white",
              border: "1px solid #555",
            }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password" // ✅ Already correct
            className="form-control"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
            required
            style={{
              backgroundColor: "#1e1e1e",
              color: "white",
              border: "1px solid #555",
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Create Account
        </button>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link text-light p-0"
            onClick={() => onSwitch("login")}
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
