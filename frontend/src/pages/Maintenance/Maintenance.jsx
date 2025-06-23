import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import styles from "./Maintenance.module.css";
import MaintenanceForm from "./MaintenanceForm";
import RequestList from "./RequestList";
import RequestDetails from "./RequestDetails";

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

  const fileReset = useRef(null);

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
      <div className={styles.maintenance}>
        <h1>Maintenance Requests</h1>
        <div className={styles.content}>
          <MaintenanceForm
            user={user}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            message={message}
            fileReset={fileReset}
          />
          <RequestList
            requests={requests}
            showAll={showAll}
            setShowAll={setShowAll}
            setSelectedRequest={setSelectedRequest}
          />
        </div>
      </div>
      {selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
}

export default Maintenance;
