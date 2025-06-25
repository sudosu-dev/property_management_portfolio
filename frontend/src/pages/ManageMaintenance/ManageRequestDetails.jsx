import { useState, useEffect } from "react";
import styles from "./ManageMaintenance.module.css";
import { API } from "../../api/ApiContext";

export default function ManageRequestDetails({
  request,
  onClose,
  onUpdate,
  onDelete,
  onComplete,
}) {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState(request.information);
  const [photos, setPhotos] = useState(request.photos || []);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    setInfo(request.information);
    setPhotos(request.photos || []);
    setEditing(false);
    setNewFiles([]);
  }, [request]);

  if (!request) return null;

  const removePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const fileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  const handleSave = async () => {
    const form = new FormData();
    form.append("information", info);

    const keepPhotoIds = photos.map((p) => p.id);
    form.append("keep_photos", JSON.stringify(keepPhotoIds));

    newFiles.forEach((file) => {
      form.append("maintenance_photos", file);
    });

    try {
      await onUpdate(request.id, form);
      setEditing(false);
      setNewFiles([]);
    } catch (err) {
      console.error("Failed to update request:", err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Request Details</h2>

        {editing ? (
          <>
            <p>
              <strong>Unit: </strong>
              {request.unit_number}
            </p>
            <div className={styles.formGroup}>
              <label>
                <strong>Issue: </strong>
                <textarea
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  rows={3}
                />
              </label>
            </div>

            <p>
              <strong>Request Date: </strong>
              {new Date(request.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>

            <p>
              <strong>Current Photos: </strong>
            </p>

            <div className={styles.photoGrid}>
              {photos.map((photo) => {
                const url = photo.photo_url;
                return (
                  <div key={photo.id} className={styles.photoItem}>
                    <img
                      src={url}
                      alt={`Photo for request ${request.id}`}
                      className={styles.enlargedPhoto}
                    />
                    <button
                      className={styles.removePhotoButton}
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Remove Photo"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={styles.formGroup}>
              <label>
                <strong>Add New Photos: </strong>
                <input type="file" multiple onChange={fileChange} />
              </label>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.primaryButton} onClick={handleSave}>
                Save
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => setEditing(false)}
              >
                Cancel Edit
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Unit: </strong>
              {request.unit_number}
            </p>
            <p>
              <strong>Issue: </strong>
              {request.information}
            </p>
            <p>
              <strong>Request Date: </strong>
              {new Date(request.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Status: </strong>
              {request.completed ? "Completed" : "Pending"}
            </p>
            {request.completed && request.completed_at && (
              <p>
                <strong>Completed On: </strong>
                {new Date(request.completed_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}

            {request?.photos.length > 0 ? (
              <div className={styles.photoGrid}>
                {request.photos.map((photo) => {
                  const url = photo.photo_url;
                  return (
                    <img
                      key={photo.id}
                      src={url}
                      alt={`Photo for request ${request.id}`}
                      className={styles.enlargedPhoto}
                    />
                  );
                })}
              </div>
            ) : (
              <p>No photos available</p>
            )}
            <div className={styles.modalActions}>
              <button
                className={styles.primaryButton}
                onClick={() => setEditing(true)}
                disabled={request.completed}
              >
                Edit
              </button>
            </div>
          </>
        )}

        <div className={styles.modalActions}>
          <button
            className={styles.primaryButton}
            onClick={() => onComplete(request.id)}
            disabled={request.completed}
          >
            Complete
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => onDelete(request.id)}
            disabled={request.completed}
          >
            Delete Request
          </button>
        </div>
      </div>
    </div>
  );
}
