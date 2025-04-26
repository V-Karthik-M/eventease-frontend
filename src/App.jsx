// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Axios Global Config
import "./axiosConfig";

// Context
import UserContextProvider from "./UserContextProvider.jsx";
import UserContext from "./UserContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Pages
import Homepage from "./pages/Homepage";
import AboutPage from "./components/Aboutpage";
import ContactPage from "./components/Contactpage";
import SupportPage from "./components/Supportpage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserAccountPage from "./pages/UserContent";
import AddEvent from "./pages/AddEvent";
import UpcomingEvents from "./pages/UpcomingEvents";
import CalendarView from "./pages/CalenderView";
import EventCalendar from "./pages/EventCalendar";
import EventPage from "./pages/EventPage";
import EditEvent from "./pages/EditEvent";
import PaymentPage from "./pages/PaymentPage";

function App() {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);

  return (
    <UserContextProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <AppRoutes />
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
      </Router>
    </UserContextProvider>
  );
}

function AppRoutes() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (token) {
          import("axios").then(({ default: axios }) => {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          });
        }
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error restoring user session:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return <div className="text-center mt-5"><strong>Loading...</strong></div>;
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Homepage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/support" element={<SupportPage />} />

      {/* Authentication Pages */}
      <Route path="/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} />
      <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />

      {/* Private Pages */}
      <Route path="/useraccount" element={<PrivateRoute><UserAccountPage /></PrivateRoute>} />
      <Route path="/addevent" element={<PrivateRoute><AddEvent /></PrivateRoute>} />
      <Route path="/upcoming-events" element={<PrivateRoute><UpcomingEvents /></PrivateRoute>} />
      <Route path="/book/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
      <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
      <Route path="/calendar-view" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
      <Route path="/event-calendar" element={<PrivateRoute><EventCalendar /></PrivateRoute>} />
      <Route path="/event/:id" element={<PrivateRoute><EventPage /></PrivateRoute>} />
      <Route path="/edit-event/:id" element={<PrivateRoute><EditEvent /></PrivateRoute>} />

      {/* Stripe Redirect Handling */}
      <Route path="/payment-success" element={<Navigate to="/useraccount" replace />} />
      <Route path="/payment-cancel" element={<h2 className="text-center mt-5">❌ Payment Cancelled</h2>} />
    </Routes>
  );
}

function PrivateRoute({ children }) {
  const { user } = useContext(UserContext);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user && token) {
      window.location.reload();
    } else {
      setChecking(false);
    }
  }, [user]);

  if (checking) {
    return <div className="text-center mt-5"><strong>Checking authentication...</strong></div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AuthRedirect({ children }) {
  const { user } = useContext(UserContext);
  return user ? <Navigate to="/upcoming-events" replace /> : children;
}

export default App;
