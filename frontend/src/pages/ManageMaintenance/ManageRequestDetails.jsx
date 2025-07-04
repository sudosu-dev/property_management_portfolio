import { useState, useEffect, useRef } from "react";
import styles from "./ManageMaintenance.module.css";

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
  const firstInputRef = useRef(null);

  useEffect(() => {
    setInfo(request.information);
    setPhotos(request.photos || []);
    setEditing(false);
    setNewFiles([]);
  }, [request]);

  // Focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (editing) {
          setEditing(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editing, onClose]);

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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-title"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close request details"
          type="button"
        >
          &times;
        </button>

        <h2 id="details-title">
          {editing ? "Edit Request" : "Request Details"}
        </h2>

        {editing ? (
          <>
            <div className={styles.requestInfo}>
              <p>
                <span>Unit: </span>
                {request.unit_number}
              </p>
              <p>
                <span>Request Date: </span>
                <time dateTime={request.created_at}>
                  {formatDate(request.created_at)}
                </time>
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="edit-issue" className={styles.formLabel}>
                Issue Description *
              </label>
              <textarea
                id="edit-issue"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                rows={3}
                className={styles.formTextarea}
                required
                ref={firstInputRef}
              />
            </div>

            <div className={styles.photoSection}>
              <h3>Current Photos</h3>
              {photos.length > 0 ? (
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
                          aria-label={`Remove photo ${photo.id}`}
                          type="button"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No photos attached</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="add-photos" className={styles.formLabel}>
                Add New Photos
              </label>
              <input
                id="add-photos"
                type="file"
                multiple
                accept="image/*"
                onChange={fileChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.primaryButton}
                onClick={handleSave}
                aria-label="Save changes to maintenance request"
              >
                Save Changes
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => setEditing(false)}
                aria-label="Cancel editing and return to view mode"
              >
                Cancel Edit
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.requestInfo}>
              <p>
                <span>Unit: </span>
                {request.unit_number}
              </p>
              <p>
                <span>Issue: </span>
                {request.information}
              </p>
              <p>
                <span>Request Date: </span>
                <time dateTime={request.created_at}>
                  {formatDate(request.created_at)}
                </time>
              </p>
              <p>
                <span>Status: </span>
                <span
                  className={
                    request.completed
                      ? styles.statusCompleted
                      : styles.statusPending
                  }
                >
                  {request.completed ? "Completed" : "Pending"}
                </span>
              </p>
              {request.completed && request.completed_at && (
                <p>
                  <span>Completed On: </span>
                  <time dateTime={request.completed_at}>
                    {formatDate(request.completed_at)}
                  </time>
                </p>
              )}
            </div>

            <div className={styles.photoSection}>
              <h3>Photos</h3>
              {request?.photos?.length > 0 ? (
                <div className={styles.photoGrid}>
                  {request.photos.map((photo) => {
                    const url = photo.photo_url;
                    return (
                      <img
                        key={photo.id}
                        src={url}
                        alt={`Photo for maintenance request ${request.id} in unit ${request.unit_number}`}
                        className={styles.enlargedPhoto}
                      />
                    );
                  })}
                </div>
              ) : (
                <p>No photos available</p>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  setEditing(true);
                  // Focus will be managed by useEffect
                  setTimeout(() => {
                    if (firstInputRef.current) {
                      firstInputRef.current.focus();
                    }
                  }, 100);
                }}
                disabled={request.completed}
                aria-label="Edit this maintenance request"
              >
                Edit Request
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => onComplete(request.id)}
                disabled={request.completed}
                aria-label="Mark this request as completed"
              >
                Mark Complete
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => onDelete(request.id)}
                disabled={request.completed}
                aria-label="Delete this maintenance request"
              >
                Delete Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
