import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import styles from "./Maintenance.module.css";

function Maintenance() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({ information: "", files: [] });
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  console.log(requests);

  return (
    <>
      <h1>Maintenance Requests</h1>
      <div className={styles.content}>
        <section className={styles.newRequests}>
          <h2>Make New Maintenance Request</h2>
          <div className={styles.requestForm}>
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
                <br />
                <textarea
                  className={styles.textBox}
                  value={formData.information}
                  type="text"
                  name="information"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                  placeholder="Please describe the issue..."
                  rows={4}
                />
              </label>
              <br />
              <label>
                <strong>Photos: </strong>
                <br />
                <input
                  type="file"
                  name="maintenance_photos"
                  multiple
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      files: Array.from(e.target.files),
                    })
                  }
                />
              </label>
              <br />
              <button type="submit">Submit Request</button>
            </form>
          </div>
          {message && <p>{message}</p>}
        </section>

        <section className={styles.allRequests}>
          <h2>Active Requests</h2>
          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <ul>
              {(showAll ? requests : requests.slice(0, 2)).map((req) => (
                <li key={req.id} onClick={() => setSelectedRequest(req)}>
                  <p>
                    <strong>Issue: </strong>
                    {req.information}
                  </p>
                  <br />
                  <p>
                    <strong>Status: </strong>
                    {req.completed ? "Completed" : "Pending"}
                  </p>
                  <br />
                  {req.photos && req.photos.length > 0 && (
                    <div className={styles.photos}>
                      {req.photos.map((photo) => {
                        const url = `${API}/${photo.photo_url.replace(
                          /\\/g,
                          `/`
                        )}`;
                        return (
                          <img
                            key={photo.id}
                            src={url}
                            alt={`Photo for request ${req.id}`}
                            className={styles.thumbnail}
                          />
                        );
                      })}
                    </div>
                  )}
                </li>
              ))}
              {requests.length > 2 && (
                <button
                  className={styles.showMore}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "Show All"}
                </button>
              )}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default Maintenance;
