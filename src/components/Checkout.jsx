import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";

export default function Checkout({ event }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements || !event) {
      setError("Stripe is not fully loaded.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare data
      const bookingData = {
        eventId: event._id,
        eventName: event.title,
        price: event.ticketPrice,
      };

      // Store in localStorage for later booking creation
      localStorage.setItem("bookingEvent", JSON.stringify({
        eventId: bookingData.eventId,
        price: bookingData.price,
      }));
      localStorage.setItem("bookingCreated", "false");

      // Call backend to get Stripe Checkout session
      const res = await axios.post(
        "http://localhost:5001/api/payment/create-checkout-session",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sessionId = res.data.id;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe redirection error:", error.message);
        setError("Failed to redirect to Stripe.");
      }
    } catch (err) {
      console.error("❌ Payment Error:", err.message || err);
      setError("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="card p-4 shadow-sm">
      <div className="mb-3">
        <label className="form-label">Card Details</label>
        <CardElement className="form-control p-2 border rounded" />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-success w-100"
      >
        {loading ? "Processing..." : `Pay $${event.ticketPrice}`}
      </button>
    </form>
  );
}
