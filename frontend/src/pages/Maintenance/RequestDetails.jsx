import { useState } from "react";
import styles from "./Maintenance.module.css";
import { API } from "../../api/ApiContext";

export default function RequestDetails({
  request,
  onClose,
  onUpdate,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState(request.information);

  if (!request) return null;

  const handleSave = () => {
    onUpdate(request.id, { information: info });
    setEditing(false);
  };

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.details} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Request Details</h2>

        {editing ? (
          <>
            <textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              rows={4}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel Edit</button>
          </>
        ) : (
          <>
            <p>
              <strong>Issue: </strong>
              {request.information}
            </p>
            <p>
              <strong>Status: </strong>
              {request.completed ? "Completed" : "Pending"}
            </p>
            <button onClick={() => setEditing(true)}>Edit</button>
          </>
        )}

        {request.photos.map((photo) => {
          const url = `${API}/${photo.photo_url.replace(/\\/g, `/`)}`;
          return (
            <img
              key={photo.id}
              src={url}
              alt={`Photo for request ${request.id}`}
              className={styles.enlargedPhoto}
            />
          );
        })}

        <div className={styles.updateDeleteButtons}>
          <button onClick={() => onDelete(request.id)}>Cancel Request</button>
        </div>
      </div>
    </div>
  );
}
