import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  fetchRequests,
  fetchUserWithUnitNumber,
  createRequest,
  updateRequest,
  deleteRequest,
} from "../../api/APIMaintenance";
import styles from "./Maintenance.module.css";
import MaintenanceForm from "./MaintenanceForm";
import RequestList from "./RequestList";
import RequestDetails from "./RequestDetails";

const FilterButton = ({ status, label, currentFilter, setFilter }) => (
  <button
    className={`${styles.filterButton} ${
      currentFilter === status ? styles.active : ""
    }`}
    onClick={() => setFilter(status)}
  >
    {label}
  </button>
);

function Maintenance() {
  const { user, token } = useAuth();
  const [fullUser, setFullUser] = useState(null);
  const [formData, setFormData] = useState({ information: "", files: [] });
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState("");

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
    if (user?.id && token) {
      fetchUserWithUnitNumber(user.id, token)
        .then(setFullUser)
        .catch(console.error);
    }
  }, [user, token]);

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
      form.append("information", formData.information);
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          form.append("maintenance_photos", file);
        });
      }

      await createRequest(form, token);

      setMessage("Maintenance request submitted successfully.");
      setTimeout(() => setMessage(""), 5000);
      setIsModalOpen(false);
      setFormData({ information: "", files: [] });
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
      await updateRequest(id, updatedData, token);
      setMessage("Maintenance request updated successfully.");
      setTimeout(() => setMessage(""), 5000);
      await loadRequests();
      setSelectedRequest(null);
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
      setTimeout(() => setMessage(""), 5000);
      await loadRequests();
      setSelectedRequest(null);
    } catch (err) {
      console.error("Delete error:", err.message);
      setMessage("Failed to cancel request");
    }
  };

  const filteredRequests = requests.filter((req) => {
    const status = req.completed ? "Completed" : "Pending";
    const statusMatch = !filter || status === filter;
    return statusMatch;
  });

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Maintenance Requests</h1>
        </header>
        <div className={styles.controls}>
          <button
            className={styles.primaryButton}
            onClick={() => setIsModalOpen(true)}
          >
            + Submit Maintenance Request
          </button>
        </div>

        <div className={styles.mainContent}>
          <aside className={styles.filters}>
            <FilterButton
              status=""
              label="All"
              currentFilter={filter}
              setFilter={setFilter}
            />
            <FilterButton
              status="Pending"
              label="Pending"
              currentFilter={filter}
              setFilter={setFilter}
            />
            <FilterButton
              status="Completed"
              label="Completed"
              currentFilter={filter}
              setFilter={setFilter}
            />
          </aside>

          <main className={styles.maintenanceList}>
            <RequestList
              requests={filteredRequests}
              setSelectedRequest={setSelectedRequest}
              filter={filter}
            />
          </main>
        </div>
      </div>
      {isModalOpen && (
        <MaintenanceForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadRequests}
          user={fullUser}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          message={message}
        />
      )}
      {selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default Maintenance;
