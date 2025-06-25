import styles from "./LandingPageNavbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function PublicNav() {
  return (
    <div className={styles.Nav}>
      <div className={styles.NavLogo}>
        <NavLink to="/">
          <p>Logo Placeholder</p>
        </NavLink>
      </div>
      <div className={styles.NavLinks}>
        <NavLink to="/about" className={styles.links}>
          About
        </NavLink>
        <NavLink to="/login" className={styles.loginButton}>
          Login
        </NavLink>
      </div>
    </div>
  );
}

function ResidentNav({ logout }) {
  return (
    <div className={styles.Nav}>
      <div className={styles.NavLogo}>
        <NavLink to="/">
          <p>Logo Placeholder</p>
        </NavLink>
      </div>
      <div className={styles.NavLinks}>
        <NavLink to="/about" className={styles.links}>
          About
        </NavLink>
        <NavLink to="/dashboard/resident" className={styles.links}>
          Dashboard
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
        <NavLink to="/about" className={styles.links}>
          About
        </NavLink>
        <NavLink to="/admin/dashboard" className={styles.links}>
          Dashboard
        </NavLink>
        <button onClick={logout} className={styles.logoutButton}>
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
    <header>
      <nav>
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
