import { useState } from "react";
import LoginPage from "./LoginPage"; 
import RegisterPage from "./RegisterPage"; // 
import "../Homepage.css";

export default function Homepage() {
  const [activeForm, setActiveForm] = useState(null);

  const handleShow = (form) => setActiveForm((prev) => (prev === form ? null : form));
  const handleClose = () => setActiveForm(null);

  return (
    <div className={`homepage-wrapper ${activeForm ? "blurred" : ""}`}>
      <div
        style={{
          backgroundImage: 'url("/background.png")', // ✅ From frontend/public
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 'calc(100vh - 56px)',
          color: 'white',
          textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
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

        <div className={`slide-form ${activeForm ? "show" : ""}`} data-testid="slide-form">
          <div className="close-btn" onClick={handleClose}>❌</div>
          {activeForm === "login" && <LoginPage onSuccess={handleClose} />}
          {activeForm === "register" && <RegisterPage onSuccess={handleClose} />}
        </div>
      </div>
    </div>
  );
}
