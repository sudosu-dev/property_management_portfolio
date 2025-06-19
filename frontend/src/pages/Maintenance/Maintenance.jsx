import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import styles from "./Maintenance.module.css";

function Maintenance() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({ information: "", files: [] });
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API}/maintenance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error loading maintenance request:", err);
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to submit a maintenance request.");
      return;
    }

    try {
      const form = new FormData();
      form.append("information", formData.information);
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          form.append("maintenance_photos", file);
        });
      }

      const res = await fetch(`${API}/maintenance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Request failed.");
      }
      setMessage("Maintenance request submitted successfully.");
      setFormData({ information: "", files: [] });
      await fetchRequests();
    } catch (err) {
      console.error("Submission error:", err.message);
      setMessage("Failed to submit request");
    }
  };

  return (
    <>
      <h1>Maintenance Requests</h1>
      <div className={styles.newRequests}>
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
              name="information"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              required
              placeholder="Please describe the issue..."
            />
          </label>
          <br />
          <label>
            <strong>Photos: </strong>
            <input
              type="file"
              name="maintenance_photos"
              multiple
              onChange={(e) =>
                setFormData({ ...formData, files: Array.from(e.target.files) })
              }
            />
          </label>
          <br />
          <button type="submit">Submit Request</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <div className={styles.allRequests}>
        <h2>All Maintenance Requests</h2>
        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <ul>
            {requests.map((req) => (
              <li key={req.id}>
                Issue: {req.information} <br />
                Status: {req.completed ? "Completed" : "Pending"} <br />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Maintenance;
