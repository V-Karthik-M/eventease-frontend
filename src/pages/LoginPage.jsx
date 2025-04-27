import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Needed for direct login page
import axios from "../axiosConfig"; 
import UserContext from "../UserContext";

export default function LoginPage({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate(); // ✅ for standalone login page redirect

  async function loginUser(ev) {
    ev.preventDefault();
    setErrorMessage("");

    try {
      const { data } = await axios.post("/auth/login", { email, password });

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

      if (onSuccess) {
        onSuccess(); // ✅ Close popup
        setTimeout(() => {
          window.location.href = "/upcoming-events"; // ✅ Full page reload
        }, 300);
      } else {
        navigate("/upcoming-events"); // ✅ If directly logged in from /login
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "❌ Login failed. Please try again."
      );
    }
  }

  return (
    <div className="card p-4 shadow-lg" style={{ width: "400px", backgroundColor: "#121212", color: "white" }}>
      <h2 className="text-center mb-4">Sign In</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <form onSubmit={loginUser}>
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
            style={{
              backgroundColor: "#1e1e1e",
              color: "white",
              border: "1px solid #555",
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => onSwitch("forgot")}
            className="btn btn-link text-light p-0"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => onSwitch("register")}
            className="btn btn-link text-light p-0"
          >
            Don’t have an account? Register
          </button>
        </div>
      </form>
    </div>
  );
}
