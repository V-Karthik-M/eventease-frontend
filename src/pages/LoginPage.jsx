import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext";

export default function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  async function loginUser(ev) {
    ev.preventDefault();
    setErrorMessage("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,  // ✅ Correct backend URL usage
        { email, password },
        { withCredentials: true }
      );

      if (!data.user || !data.token) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      alert("🎉 Login successful!");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        navigate("/upcoming-events");
      }, 300);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "❌ Login failed. Please try again."
      );
    }
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", backgroundColor: "#121212", color: "white" }}
        data-testid="login-card"
      >
        <h2 className="text-center mb-4">Sign In</h2>

        {errorMessage && (
          <div className="alert alert-danger text-center" data-testid="login-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={loginUser} data-testid="login-form">
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
              data-testid="email-input"
              style={{
                backgroundColor: "#1e1e1e",
                color: "white",
                border: "1px solid #555",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              data-testid="password-input"
              style={{
                backgroundColor: "#1e1e1e",
                color: "white",
                border: "1px solid #555",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            data-testid="login-button"
          >
            Login
          </button>

          <div className="text-center mt-3">
            <Link to="/forgotpassword" className="text-decoration-none text-light">
              Forgot Password?
            </Link>
          </div>
          <div className="text-center mt-3">
            <Link to="/register" className="text-decoration-none text-light">
              Don’t have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
