import { useEffect, useState } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  isToday,
} from "date-fns";
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";

export default function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/events") 
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  return (
    <div className="page-content container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
        >
          <BsCaretLeftFill className="me-1" />
          Previous
        </button>

        <h3 className="text-center">{format(currentMonth, "MMMM yyyy")}</h3>

        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          Next
          <BsFillCaretRightFill className="ms-1" />
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : (
        <div className="row g-2">
          {daysInMonth.map((date) => (
            <div key={date.toISOString()} className="col-6 col-sm-4 col-md-2">
              <div
                className={`border rounded p-2 text-center h-100 ${
                  isToday(date) ? "bg-warning text-white fw-bold" : "bg-light"
                }`}
              >
                <div>{format(date, "dd")}</div>
                <div className="mt-2">
                  {events
                    .filter(
                      (event) =>
                        format(new Date(event.eventDate), "yyyy-MM-dd") ===
                        format(date, "yyyy-MM-dd")
                    )
                    .map((event) => (
                      <p
                        key={event._id}
                        className="badge bg-info text-wrap d-block mb-1"
                      >
                        {event.title}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
