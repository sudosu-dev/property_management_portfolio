import styles from "./Navbar.module.css";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <header className={styles.navbar}>
      <NavLink className={styles.brand} to="/">
        <p>Logo Placeholder</p>
      </NavLink>
      <nav>
        {}
        {token ? (
          <div className={styles.loggedInNav}>
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
        ) : (
          <div className={styles.landingPageNav}>
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
        )}
      </nav>
    </header>
  );
}
