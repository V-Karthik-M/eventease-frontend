export default function SupportPage() {
    return (
      <div className="container py-5 text-dark" data-aos="fade-up">
        <h2 className="mb-4 fw-bold text-center">Support & FAQs</h2>
  
        <p className="mb-4 text-center">
          Need help navigating EventEase? You're in the right place.
          Below you'll find answers to our most common questions.
        </p>
  
        <div className="mb-4">
          <h5 className="fw-semibold">📌 How do I create an event?</h5>
          <p>
            Once logged in, go to the <strong>“Add Event”</strong> page, fill in the event details,
            upload a banner image, and click publish. Your event will instantly go live!
          </p>
        </div>
  
        <div className="mb-4">
          <h5 className="fw-semibold">🎟️ Can I manage ticketing through EventEase?</h5>
          <p>
            Yes! EventEase integrates seamlessly with Stripe to let you accept payments for paid events,
            offer free RSVPs, and manage attendee data all in one dashboard.
          </p>
        </div>
  
        <div className="mb-4">
          <h5 className="fw-semibold">🛟 Still need help?</h5>
          <p>
            Contact our support team at <a href="mailto:support@eventease.com">support@eventease.com</a>.
            We're always happy to assist!
          </p>
        </div>
      </div>
    );
  }
  