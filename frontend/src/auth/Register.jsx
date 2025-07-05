import { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Register.module.css";
import { useAuth } from "./AuthContext";
import { useNotifications } from "../Context/NotificationContext";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const onRegister = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const unit = formData.get("unit");

    setIsLoading(true);

    try {
      await register({ username, password, firstName, lastName, email, unit });

      addNotification(
        "Account created successfully! Welcome aboard!",
        "success"
      );

      navigate("/");
    } catch (e) {
      addNotification(
        e.message || "Registration failed. Please try again.",
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
          <h1>Create Your Account</h1>
          <p>Join our community and get started today</p>
        </div>

        <div className={styles.formContainer}>
          <form action={onRegister} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.formLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={styles.formInput}
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.formLabel}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={styles.formInput}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

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
              <label htmlFor="email" className={styles.formLabel}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.formInput}
                required
                autoComplete="email"
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
                autoComplete="new-password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="unit" className={styles.formLabel}>
                Unit Number <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="number"
                id="unit"
                name="unit"
                className={styles.formInput}
                min="1"
                autoComplete="off"
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {isLoading && (
              <div className={styles.srOnly} role="status" aria-live="polite">
                Creating your account, please wait...
              </div>
            )}
          </form>

          <div className={styles.linkContainer}>
            <Link to="/login" className={styles.loginLink}>
              Already have an account? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
