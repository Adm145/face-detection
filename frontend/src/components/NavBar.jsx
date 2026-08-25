import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/", label: "Search" },
  { to: "/enroll", label: "Enroll" },
  { to: "/people", label: "People" },
  { to: "/compare", label: "Compare" },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-brand" onClick={closeMenu}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2 6V3a1 1 0 0 1 1-1h3M18 6V3a1 1 0 0 0-1-1h-3M2 14v3a1 1 0 0 0 1 1h3M18 14v3a1 1 0 0 1-1 1h-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>FaceDB</span>
      </Link>

      <div className="nav-links">
        {LINKS.map((link) => {
          const isActive =
            link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${isActive ? " nav-link-active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="nav-auth">
        {isAuthenticated ? (
          <button
            type="button"
            className="nav-auth-link"
            onClick={handleLogout}
          >
            Log out
          </button>
        ) : (
          <Link to="/login" className="nav-auth-link">
            Log in
          </Link>
        )}
      </div>

      <button
        type="button"
        className="nav-hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {LINKS.map((link) => {
            const isActive =
              link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-mobile-link${isActive ? " nav-link-active" : ""}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="nav-mobile-divider" />
          {isAuthenticated ? (
            <button type="button" className="nav-mobile-link" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <Link to="/login" className="nav-mobile-link" onClick={closeMenu}>
              Log in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
