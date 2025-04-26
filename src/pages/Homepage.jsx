import { useState } from "react";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import "../Homepage.css";

export default function Homepage() {
  const [activeForm, setActiveForm] = useState(null);

  const handleShow = (form) => {
    setActiveForm(form);
  };

  const handleClose = () => {
    setActiveForm(null);
  };

  return (
    <div className={`homepage-wrapper ${activeForm ? "blurred" : ""}`}>
      <div
        className="homepage-content"
        style={{
          backgroundImage: 'url("/background.png")',
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
      </div>

      {/* Slide Form */}
      {activeForm && (
        <div className="slide-form show">
          <div className="close-btn" onClick={handleClose}>❌</div>
          {activeForm === "login" && <LoginPage onSuccess={handleClose} />}
          {activeForm === "register" && <RegisterPage onSuccess={handleClose} />}
        </div>
      )}
    </div>
  );
}
