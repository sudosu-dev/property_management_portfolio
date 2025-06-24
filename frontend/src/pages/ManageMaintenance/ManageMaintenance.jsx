import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  fetchRequests,
  createRequest,
  updateRequest,
  deleteRequest,
  markRequestComplete,
} from "../../api/APIMaintenance";
import styles from "./ManageMaintenance.module.css";
import ManageMaintenanceForm from "./ManageMaintenanceForm";
import ManageRequestList from "./ManageRequestList";
import ManageRequestDetails from "./ManageRequestDetails";

function ManageMaintenance() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    unit_number: "",
    information: "",
    files: [],
  });
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fileReset = useRef(null);

  const loadRequests = async () => {
    try {
      const data = await fetchRequests(token);
      setRequests(data);
    } catch (err) {
      console.error("Error loading maintenance request:", err);
    }
  };

  useEffect(() => {
    if (token) loadRequests();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to submit a maintenance request.");
      return;
    }
    try {
      const form = new FormData();
      form.append("unit_number", Number(formData.unit_number));
      form.append("information", formData.information);
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          form.append("maintenance_photos", file);
        });
      }

      await createRequest(form, token);

      setMessage("Maintenance request submitted successfully.");
      setFormData({ unit_number: "", information: "", files: [] });
      if (fileReset.current) {
        fileReset.current.value = null;
      }
      await loadRequests();
    } catch (err) {
      console.error("Submission error:", err.message);
      setMessage("Failed to submit request");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    if (!user || !token) {
      alert("You must be logged in to submit a request.");
      return;
    }
    try {
      const updatedRequest = await updateRequest(id, updatedData, token);
      setMessage("Maintenance request updated successfully.");
      setTimeout(() => setMessage(""), 5000);
      await loadRequests();
      setSelectedRequest(updatedRequest);
    } catch (err) {
      console.error("Update error:", err.message);
      setMessage("Failed to update request");
    }
  };

  const handleDelete = async (id) => {
    if (!user || !token) {
      alert("You must be logged in to delete a request.");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }
    try {
      await deleteRequest(id, token);
      setMessage("Maintenance request cancelled successfully.");
      await loadRequests();
      setSelectedRequest(null);
    } catch (err) {
      console.error("Delete error:", err.message);
      setMessage("Failed to cancel request");
    }
  };

  const handleComplete = async (id) => {
    if (!user || !token) {
      alert("You must be logged in to submit a request.");
      return;
    }
    try {
      const updatedRequest = await markRequestComplete(id, token);
      setMessage("Maintenance request completed.");
      setTimeout(() => setMessage(""), 5000);
      await loadRequests();
      setSelectedRequest(updatedRequest);
    } catch (err) {
      console.error("Complete error:", err.message);
      setMessage("Failed to mark request at completed.");
    }
  };

  return (
    <>
      <div className={styles.maintenance}>
        <h1>Maintenance Requests</h1>
        <div className={styles.content}>
          <ManageMaintenanceForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            message={message}
            fileReset={fileReset}
          />
          <ManageRequestList
            requests={requests}
            showAll={showAll}
            setShowAll={setShowAll}
            setSelectedRequest={setSelectedRequest}
          />
        </div>
      </div>
      {selectedRequest && (
        <ManageRequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      )}
    </>
  );
}

export default ManageMaintenance;
