import { useState } from "react";
import { Link, useNavigate } from "react-router";

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
      <h1>Register for an account</h1>
      <form action={onRegister}>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <label>
          First Name
          <input type="text" name="firstName" required />
        </label>
        <label>
          Last Name
          <input type="text" name="lastName" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Unit
          <input type="number" name="unit" />
        </label>
        <button>Register</button>
        {error && <output>an error occurred, please try again</output>}
      </form>
      <Link to="/login">Already have an account? Log in here.</Link>
    </>
  );
}
