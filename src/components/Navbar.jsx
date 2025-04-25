import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm custom-navbar">
      <div className="container">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "navbar-brand" + (isActive ? " fw-bold text-warning" : "")
          }
        >
          EventEase
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/support", label: "Support" },
            ].map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    "nav-link px-2 py-1" +
                    (isActive
                      ? " fw-bold text-warning border-bottom border-warning"
                      : "")
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
