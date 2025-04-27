import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🆕 added
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPassword from "./ForgotPassword";
import "../Homepage.css";

export default function Homepage() {
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate(); // 🆕 added

  const handleShow = (form) => {
    setActiveForm(form);
  };

  const handleCloseAndRedirect = () => {
    setActiveForm(null);
    navigate("/upcoming-events"); // 🆕 after login success, go to upcoming-events
  };

  const handleClose = () => {
    setActiveForm(null); // normal close (if just cancel form)
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

        {/* Popup Form Area */}
        {activeForm && (
          <div className="slide-form show">
            <div className="close-btn" onClick={handleClose}>❌</div>

            {activeForm === "login" && (
              <LoginPage onSuccess={handleCloseAndRedirect} onSwitch={handleSwitch} />
              // 🆕 here, use handleCloseAndRedirect instead of normal close
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

      {/* Blurred Background when form is open */}
      {activeForm && <div className="overlay"></div>}
    </div>
  );
}
