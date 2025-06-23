import styles from "./ManageMaintenance.module.css";
import { API } from "../../api/ApiContext";

export default function ManageRequestDetails({ request, onClose }) {
  if (!request) return null;

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.details} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Request Details</h2>
        <p>
          <strong>Unit: </strong>
          {request.unit_number}
        </p>
        <br />
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
        <br />
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
