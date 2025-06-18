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
            <NavLink to="/profile">profile</NavLink>
            <NavLink to="/payments">payments</NavLink>
            <NavLink to="/maintenance">maintenance</NavLink>
            <button onClick={logout}>Log out</button>
          </div>
        ) : (
          <div className={styles.landingPageNav}>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/about">about</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
