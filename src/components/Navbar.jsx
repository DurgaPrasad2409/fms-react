import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark"></span> Feedback System
      </div>
      <nav className="nav-links">
        {!user && (
          <>
            <NavLink to="/login">Sign In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}

        {user && user.role === "user" && (
          <>
            <span className="hint">Hi, {user.name}</span>
            <NavLink to="/feedback">Give Feedback</NavLink>
            <NavLink to="/my-feedback">My Feedback</NavLink>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <span className="hint">Admin: {user.name}</span>
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/analytics">Analytics</NavLink>
          </>
        )}

        {user && <a href="#logout" onClick={handleLogout}>Log out</a>}
      </nav>
    </header>
  );
}
