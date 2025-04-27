import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPassword from "./ForgotPassword";
import "../Homepage.css";

export default function Homepage() {
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate();

  const handleShow = (form) => {
    setActiveForm(form);
  };

  const handleClose = () => {
    setActiveForm(null);
  };

  const handleCloseAndRedirect = () => {
    setActiveForm(null);
    setTimeout(() => {
      navigate("/upcoming-events");
    }, 300); // Slight delay for smoother UX
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

        {activeForm && (
          <div className="slide-form show">
            <div className="close-btn" onClick={handleClose}>❌</div>

            {activeForm === "login" && (
              <LoginPage onSuccess={handleCloseAndRedirect} onSwitch={handleSwitch} />
            )}
            {activeForm === "register" && (
              <RegisterPage onSuccess={handleCloseAndRedirect} onSwitch={handleSwitch} />
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
