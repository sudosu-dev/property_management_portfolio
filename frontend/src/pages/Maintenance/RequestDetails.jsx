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
  const [photos, setPhotos] = useState(request.photos);
  const [newFiles, setNewFiles] = useState([]);

  if (!request) return null;

  const removePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const fileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  const handleSave = () => {
    const form = new FormData();
    form.append("information", info);

    const keepPhotoIds = photos.map((p) => p.id);
    form.append("keep_photos", JSON.stringify(keepPhotoIds));

    newFiles.forEach((file) => {
      form.append("maintenance_photos", file);
    });

    try {
      onUpdate(request.id, form);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update request:", err);
    }
  };

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.details} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Request Details</h2>
        {editing ? (
          <div className={styles.editForm}>
            <p>
              <strong>Issue: </strong>
              <textarea
                className={styles.text}
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                rows={4}
              />
            </p>
            <p>
              <strong>Current Photos: </strong>
            </p>
            <div className={styles.photoGrid}>
              {photos.map((photo) => {
                const url = `${API}/${photo.photo_url.replace(/\\/g, `/`)}`;
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
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>

            <p>
              <strong>Add New Photos: </strong>
              <input type="file" multiple onChange={fileChange} />
            </p>
            <div className={styles.editButtons}>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel Edit</button>
            </div>
          </div>
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
            <button
              className={styles.editButton}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          </>
        )}

        <button
          className={styles.deleteButton}
          onClick={() => onDelete(request.id)}
        >
          Delete Request
        </button>
      </div>
    </div>
  );
}
