import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import styles from "./Maintenance.module.css";
import { API } from "../../api/ApiContext";

function Maintenance() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to submit a maintenance request.");
      return;
    }

    try {
      const response = await fetch(`${API}/maintenance`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          information: formData.information,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Request faied.");
      }
      setMessage("Maintenance request submitted successfully.");
      setFormData({ information: "" });
    } catch (err) {
      console.error("Submission error:", err.message);
      setMessage("Failed to submit request");
    }
  };

  return (
    <>
      <h1>Maintenance Requests</h1>
      <div className={styles.requests}>
        <h2>Make New Maintenance Request</h2>
        <div className={styles.info}>
          <p>
            <strong>Name:</strong> {`${user.first_name} ${user.last_name}`}
          </p>
          <p>
            <strong>Unit: </strong> {`${user.unit}`}
          </p>
          <p>
            <strong>Email: </strong> {`${user.email}`}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            <strong>Issue: </strong>
            <input
              value={formData.information}
              type="text"
              name="issue"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              required
              placeholder="Please describe the issue..."
            />
          </label>
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </>
  );
}

export default Maintenance;
