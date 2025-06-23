import { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Register.module.css";

import { useAuth } from "./AuthContext";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onRegister = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const unit = formData.get("unit");

    try {
      await register({ username, password, firstName, lastName, email, unit });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className={styles.register}>
        <div className={styles.registerForm}>
          <h1>Register For An Account</h1>
          <form action={onRegister}>
            <label>
              <strong>Username: </strong>
              <input type="text" name="username" required />
            </label>
            <label>
              <strong>Password: </strong>
              <input type="password" name="password" required />
            </label>
            <label>
              <strong>First Name: </strong>
              <input type="text" name="firstName" required />
            </label>
            <label>
              <strong>Last Name: </strong>
              <input type="text" name="lastName" required />
            </label>
            <label>
              <strong>Email: </strong>
              <input type="email" name="email" required />
            </label>
            <label>
              <strong>Unit: </strong>
              <input type="number" name="unit" />
            </label>
            <button>Register</button>
            {error && <output>an error occurred, please try again</output>}
          </form>
          <Link to="/login">Already have an account? Log in here.</Link>
        </div>
      </div>
    </>
  );
}
