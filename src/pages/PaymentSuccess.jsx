import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  useEffect(() => {
    const saveBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:5001/api/bookings", {
          eventId: event._id,
          amount: event.ticketPrice,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("❌ Failed to save booking:", err);
      }
    };

    if (event) saveBooking();
  }, [event]);

  return (
    <div className="page-content container text-center">
      <h2 className="mt-5">✅ Payment Successful!</h2>
      <p>Thank you for booking. Your transaction has been saved.</p>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/useraccount")}>
        Go to My Account
      </button>
    </div>
  );
}
