import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPassword from "./ForgotPassword";
import "../Homepage.css";
import UserContext from "../UserContext"; // ✅ import this

export default function Homepage() {
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // ✅ access user from context

  useEffect(() => {
    if (user) {
      navigate("/upcoming-events");
    }
  }, [user, navigate]); // ✅ whenever user changes, check and navigate

  const handleShow = (form) => {
    setActiveForm(form);
  };

  const handleClose = () => {
    setActiveForm(null);
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
              <LoginPage onSuccess={handleClose} onSwitch={handleSwitch} />
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
