import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

import { useAuth } from "./AuthContext";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onLogin = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const loggedInUser = await login({ username, password });

      if (loggedInUser.is_manager) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard/resident");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className={styles.login}>
        <div className={styles.loginForm}>
          <h1>Login</h1>
          <form action={onLogin}>
            <label>
              <strong>Username: </strong>
              <input type="username" name="username" required />
            </label>
            <label>
              <strong>Password: </strong>
              <input type="password" name="password" required />
            </label>
            <button>Login</button>
            {error && <output>{error}</output>}
          </form>
          <Link to="/register">Need an account? Register here.</Link>
        </div>
      </div>
    </>
  );
}
