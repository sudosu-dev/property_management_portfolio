import { useState, useEffect } from "react";
import styles from "./LandingPageNavbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import rentaLogo from "../assets/renta-logo.png";

function PublicNav() {
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
          to="/about"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="information-circle-outline"></ion-icon>
          About
        </NavLink>
        <NavLink
          to="/login"
          className={styles.loginButton}
          onClick={() => setIsOpen(false)}
        >
          Login
        </NavLink>
      </div>
    </div>
  );
}

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
          to="/about"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="information-circle-outline"></ion-icon>
          About
        </NavLink>
        <NavLink
          to="/dashboard/resident"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="apps-outline"></ion-icon>
          Dashboard
        </NavLink>
        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function ManagerNav({ logout }) {
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
          to="/about"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="information-circle-outline"></ion-icon>
          About
        </NavLink>
        <NavLink
          to="/admin/dashboard"
          className={styles.links}
          onClick={() => setIsOpen(false)}
        >
          <ion-icon name="apps-outline"></ion-icon>
          Dashboard
        </NavLink>
        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function LandingPageNavbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        {!token ? (
          <PublicNav />
        ) : user?.is_manager ? (
          <ManagerNav logout={handleLogout} />
        ) : (
          <ResidentNav logout={handleLogout} />
        )}
      </nav>
    </header>
  );
}
