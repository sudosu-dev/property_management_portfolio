import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  fetchRequests,
  createRequest,
  updateRequest,
  deleteRequest,
  markRequestComplete,
  fetchUnits,
} from "../../api/APIMaintenance";
import styles from "./ManageMaintenance.module.css";
import ManageMaintenanceForm from "./ManageMaintenanceForm";
import ManageRequestList from "./ManageRequestList";
import ManageRequestDetails from "./ManageRequestDetails";

function addUnitNumberToRequest(request, units) {
  if (!request.unit_number) {
    const unitId = request.unit || request.unit_id;
    const unit = units.find((u) => u.id === unitId);
    if (unit) {
      return { ...request, unit_number: unit.unit_number };
    }
  }
  return request;
}

function ManageMaintenance() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    unit_number: "",
    information: "",
    files: [],
  });
  const [units, setUnits] = useState([]);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fileReset = useRef(null);

  const loadRequests = async () => {
    try {
      let data = await fetchRequests(token);
      data = data.map((request) => addUnitNumberToRequest(request, units));
      setRequests(data);
    } catch (err) {
      console.error("Error loading maintenance request:", err);
    }
  };

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const data = await fetchUnits(token);
        setUnits(data);
      } catch (err) {
        console.error("Failed to fetch units:", err);
      }
    };
    if (token) loadUnits();
  }, [token]);

  useEffect(() => {
    if (token && units.length > 0) {
      loadRequests();
    }
  }, [token, units]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("You must be logged in to submit a maintenance request.");
      return;
    }
    try {
      const form = new FormData();
      form.append("unit_number", formData.unit_number);
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
      await updateRequest(id, updatedData, token);
      setMessage("Maintenance request updated successfully.");
      setTimeout(() => setMessage(""), 5000);
      await loadRequests();

      const updated = requests.find((r) => r.id === id);
      if (updated) {
        setSelectedRequest(addUnitNumberToRequest(updated, units));
      }
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
      let updatedRequest = await markRequestComplete(id, token);
      updatedRequest = addUnitNumberToRequest(updatedRequest, units);
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
            units={units}
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
