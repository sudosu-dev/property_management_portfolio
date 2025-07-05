import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "./AuthContext";
import { useNotifications } from "../Context/NotificationContext";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async (formData) => {
    console.log("onLogin called!"); // debug remove
    const username = formData.get("username");
    const password = formData.get("password");
    console.log("Form data:", { username, password }); // debug remove

    setIsLoading(true);

    try {
      const loggedInUser = await login({ username, password });

      addNotification("Successfully logged in!", "success");

      if (loggedInUser.is_manager) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard/resident");
      }
    } catch (e) {
      addNotification(
        e.message || "Login failed. Please check your credentials.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>

        <div className={styles.formContainer}>
          <form action={onLogin} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={styles.formInput}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.formInput}
                required
                autoComplete="current-password"
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            {isLoading && (
              <div className={styles.srOnly} role="status" aria-live="polite">
                Signing you in, please wait...
              </div>
            )}
          </form>

          <div className={styles.linkContainer}>
            <Link to="/register" className={styles.registerLink}>
              Need an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
