import styles from "./ManageMaintenance.module.css";
import { API } from "../../api/ApiContext";

export default function ManageRequestList({
  requests,
  showAll,
  setShowAll,
  setSelectedRequest,
}) {
  return (
    <section className={styles.activeRequests}>
      <h2>Active Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul>
          {(showAll ? requests : requests.slice(0, 2)).map((req) => (
            <li key={req.id} onClick={() => setSelectedRequest(req)}>
              <p>
                <strong>Unit: </strong>
                {req.unit_number}
              </p>
              <br />
              <p>
                <strong>Request Date: </strong>
                {new Date(req.created_at).toLocaleString("en-US", {
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
                {req.information}
              </p>
              <br />
              <p>
                <strong>Status: </strong>
                {req.completed ? "Completed" : "Pending"}
              </p>
              <br />
              {req.photos && req.photos.length > 0 && (
                <div className={styles.photos}>
                  {req.photos.map((photo) => {
                    const url = `${API}/${photo.photo_url.replace(/\\/g, `/`)}`;
                    return (
                      <img
                        key={photo.id}
                        src={url}
                        alt={`Photo for request ${req.id}`}
                        className={styles.thumbnail}
                      />
                    );
                  })}
                </div>
              )}
            </li>
          ))}
          {requests.length > 2 && (
            <button
              className={styles.showMore}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          )}
        </ul>
      )}
    </section>
  );
}
