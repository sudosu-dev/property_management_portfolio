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
        {token ? (
          <div className={styles.loggedInNav}>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/payments">Payments</NavLink>
            <NavLink to="/maintenance">Maintenance</NavLink>
            <button onClick={logout}>Log Out</button>
          </div>
        ) : (
          <div className={styles.landingPageNav}>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
