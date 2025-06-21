import styles from "./Maintenance.module.css";
import { API } from "../../api/ApiContext";

export default function RequestDetails({ request, onClose }) {
  if (!request) return null;

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.details} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Request Details</h2>
        <p>
          <strong>Issue: </strong>
          {request.information}
        </p>
        <br />
        <p>
          <strong>Status: </strong>
          {request.completed ? "Completed" : "Pending"}
        </p>
        <br />
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
      </div>
    </div>
  );
}
