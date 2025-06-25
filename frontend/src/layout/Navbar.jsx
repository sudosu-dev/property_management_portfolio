import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ResidentNav({ logout }) {
  return (
    <div className={styles.Nav}>
      <div className={styles.NavLogo}>
        <NavLink to="/">
          <p>Logo Placeholder</p>
        </NavLink>
      </div>
      <div className={styles.NavLinks}>
        <NavLink to="/dashboard/resident" className={styles.links}>
          <ion-icon name="apps-outline"></ion-icon>
          Dashboard
        </NavLink>
        <NavLink to="/payments" className={styles.links}>
          <ion-icon name="card-outline"></ion-icon>
          Payments
        </NavLink>
        <NavLink to="/maintenance" className={styles.links}>
          <ion-icon name="build-outline"></ion-icon>
          Maintenance
        </NavLink>
        <NavLink to="/announcements" className={styles.links}>
          <ion-icon name="megaphone-outline"></ion-icon>
          Announcements
        </NavLink>
        <NavLink to="/profile" className={styles.links}>
          <ion-icon name="person-outline"></ion-icon>
          Profile
        </NavLink>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}

function ManagerNav({ logout }) {
  return (
    <div className={styles.Nav}>
      <div className={styles.NavLogo}>
        <NavLink to="/">
          <p>Logo Placeholder</p>
        </NavLink>
      </div>
      <div className={styles.NavLinks}>
        <NavLink to="/admin/dashboard" className={styles.links}>
          <ion-icon name="apps-outline"></ion-icon>
          Dashboard
        </NavLink>
        <NavLink to="/admin/propertyinfo" className={styles.links}>
          <ion-icon name="business-outline"></ion-icon>
          Property Info
        </NavLink>
        <NavLink to="/admin/units" className={styles.links}>
          <ion-icon name="bed-outline"></ion-icon>
          Units
        </NavLink>
        <NavLink to="/admin/residents" className={styles.links}>
          <ion-icon name="people-outline"></ion-icon>
          Residents
        </NavLink>
        <NavLink to="/admin/payments" className={styles.links}>
          <ion-icon name="card-outline"></ion-icon>
          Payments
        </NavLink>
        <NavLink to="/admin/utilities" className={styles.links}>
          <ion-icon name="bulb-outline"></ion-icon>
          Utilities
        </NavLink>
        <NavLink to="/admin/maintenance" className={styles.links}>
          <ion-icon name="build-outline"></ion-icon>
          Maintenance
        </NavLink>
        <NavLink to="/admin/announcements" className={styles.links}>
          <ion-icon name="megaphone-outline"></ion-icon>
          Announcements
        </NavLink>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <nav>
        {user?.is_manager ? (
          <ManagerNav logout={handleLogout} />
        ) : (
          <ResidentNav logout={handleLogout} />
        )}
      </nav>
    </header>
  );
}
