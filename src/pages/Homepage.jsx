import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPassword from "./ForgotPassword";
import "../Homepage.css";
import UserContext from "../UserContext";

export default function Homepage() {
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext); // ✅ Watch user and token

  useEffect(() => {
    if (user && token) {
      console.log("✅ User detected, navigating to /upcoming-events");
      navigate("/upcoming-events", { replace: true });
    }
  }, [user, token, navigate]); // ✅ Listen for both

  const handleShow = (form) => {
    setActiveForm(form);
  };

  const handleClose = () => {
    setActiveForm(null);
  };

  const handleLoginSuccess = () => {
    setActiveForm(null);
    // No need to manually navigate anymore, useEffect will do it automatically
  };

  const handleSwitch = (targetForm) => {
    setActiveForm(targetForm);
  };

  return (
    <div className={`homepage-wrapper ${activeForm ? "blurred" : ""}`}>
      <div
        style={{
          backgroundImage: 'url("/background.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "calc(100vh - 56px)",
          color: "white",
          textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <h1>Welcome to EventEase!</h1>
        <p>Your one-stop platform to manage, attend, and create events effortlessly.</p>

        <div className="mt-4">
          <button
            className="btn btn-outline-light mx-2"
            onClick={() => handleShow("login")}
          >
            Login
          </button>
          <button
            className="btn btn-outline-light mx-2"
            onClick={() => handleShow("register")}
          >
            Register
          </button>
        </div>

        {/* Slide Form */}
        {activeForm && (
          <div className="slide-form show">
            <div className="close-btn" onClick={handleClose}>❌</div>

            {activeForm === "login" && (
              <LoginPage onSuccess={handleLoginSuccess} onSwitch={handleSwitch} />
            )}
            {activeForm === "register" && (
              <RegisterPage onSuccess={handleClose} onSwitch={handleSwitch} />
            )}
            {activeForm === "forgot" && (
              <ForgotPassword onSwitch={handleSwitch} />
            )}
          </div>
        )}
      </div>

      {activeForm && <div className="overlay"></div>}
    </div>
  );
}
