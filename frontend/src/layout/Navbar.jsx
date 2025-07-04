import { useState } from "react";
import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import rentaLogo from "../assets/renta-logo.png";

function ResidentNav({ logout }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className={styles.Nav}>
      <div className={styles.NavLogo}>
        <NavLink to="/">
          <img width={"45px"} src={rentaLogo} alt="logo" />
        </NavLink>
      </div>

      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        className={`${styles.NavLinks} ${isOpen ? styles.NavLinksOpen : ""}`}
      >
        <NavLink
          to="/dashboard/resident"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="apps-outline"></ion-icon>
          Dashboard
        </NavLink>
        <NavLink
          to="/payments"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="card-outline"></ion-icon>
          Payments
        </NavLink>
        <NavLink
          to="/maintenance"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="build-outline"></ion-icon>
          Maintenance
        </NavLink>
        <NavLink
          to="/announcements"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="megaphone-outline"></ion-icon>
          Announcements
        </NavLink>
        <NavLink
          to="/profile"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.Nav}>
      <div className={styles.NavLogo}>
        <NavLink to="/">
          <img width={"45px"} src={rentaLogo} alt="logo" />
        </NavLink>
      </div>

      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        className={`${styles.NavLinks} ${isOpen ? styles.NavLinksOpen : ""}`}
      >
        <NavLink
          to="/admin/dashboard"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="apps-outline"></ion-icon>
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/propertyinfo"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="business-outline"></ion-icon>
          Property Info
        </NavLink>
        <NavLink
          to="/admin/units"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="bed-outline"></ion-icon>
          Units
        </NavLink>
        <NavLink
          to="/admin/manage-users"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="people-outline"></ion-icon>
          Manage Users
        </NavLink>
        <NavLink
          to="/admin/payments"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="card-outline"></ion-icon>
          Payments
        </NavLink>
        <NavLink
          to="/admin/utilities"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="bulb-outline"></ion-icon>
          Utilities
        </NavLink>
        <NavLink
          to="/admin/maintenance"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="build-outline"></ion-icon>
          Maintenance
        </NavLink>
        <NavLink
          to="/admin/announcements"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
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
  const { logout, user } = useAuth();
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
