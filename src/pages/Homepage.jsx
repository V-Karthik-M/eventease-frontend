import { useState } from "react";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import "../Homepage.css";

export default function Homepage() {
  const [activeForm, setActiveForm] = useState(null);

  const handleShow = (form) => {
    setActiveForm((prev) => (prev === form ? null : form));
  };

  const handleClose = () => {
    setActiveForm(null);
  };

  return (
    <div className="homepage-wrapper">
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
            data-testid="open-login"
          >
            Login
          </button>
          <button
            className="btn btn-outline-light mx-2"
            onClick={() => handleShow("register")}
            data-testid="open-register"
          >
            Register
          </button>
        </div>

        {/* Popup Form */}
        {activeForm && (
          <div className="slide-form show" data-testid="slide-form">
            <div className="close-btn" onClick={handleClose}>❌</div>
            {activeForm === "login" && <LoginPage onSuccess={handleClose} />}
            {activeForm === "register" && <RegisterPage onSuccess={handleClose} />}
          </div>
        )}
      </div>

      {/* Blurred Background when form is open */}
      {activeForm && <div className="overlay"></div>}
    </div>
  );
}
