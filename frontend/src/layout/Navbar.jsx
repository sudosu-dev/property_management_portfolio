import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ResidentNav({ logout }) {
  return (
    <div className={styles.residentNav}>
      <NavLink to="/dashboard" className={styles.links}>
        Dashboard
      </NavLink>
      <NavLink to="/payments" className={styles.links}>
        Payments
      </NavLink>
      <NavLink to="/maintenance" className={styles.links}>
        Maintenance
      </NavLink>
      <NavLink to="/announcements" className={styles.links}>
        Announcements
      </NavLink>
      <NavLink to="/profile" className={styles.links}>
        Profile
      </NavLink>
      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

function ManagerNav({ logout }) {
  return (
    <div className={styles.managerNav}>
      <NavLink to="/admin/dashboard" className={styles.links}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/properties" className={styles.links}>
        Property Info
      </NavLink>
      <NavLink to="/admin/units" className={styles.links}>
        Units
      </NavLink>
      <NavLink to="/admin/residents" className={styles.links}>
        Residents
      </NavLink>
      <NavLink to="/admin/payments" className={styles.links}>
        Payments
      </NavLink>
      <NavLink to="/admin/utilities" className={styles.links}>
        Utilities
      </NavLink>
      <NavLink to="/admin/maintenance" className={styles.links}>
        Maintenance
      </NavLink>
      <NavLink to="/admin/community" className={styles.links}>
        Announcements
      </NavLink>
      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

function PublicNav() {
  return (
    <div className={styles.landingPageNav}>
      <div>
        <NavLink className={styles.landingPageNavLogo} to="/">
          <p>Logo Placeholder</p>
        </NavLink>
      </div>
      <div className={styles.landingPageNavLinks}>
        <NavLink to="/about" className={styles.links}>
          About
        </NavLink>
        <NavLink to="/login" className={styles.links}>
          Property Managers
        </NavLink>
        <NavLink to="/login" className={styles.loginButton}>
          Resident Login
        </NavLink>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { token, logout, user } = useAuth();

  return (
    <header>
      <nav>
        {!token ? (
          <PublicNav />
        ) : user?.is_manager ? (
          <ManagerNav logout={logout} />
        ) : (
          <ResidentNav logout={logout} />
        )}
      </nav>
    </header>
  );
}
