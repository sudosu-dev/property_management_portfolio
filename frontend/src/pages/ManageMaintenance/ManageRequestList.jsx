import styles from "./ManageMaintenance.module.css";
import { API } from "../../api/ApiContext";

export default function ManageRequestList({
  requests,
  showAll,
  setShowAll,
  setSelectedRequest,
  filter,
}) {
  const filteredRequests = requests.filter((req) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !req.completed;
    if (filter === "Completed") return req.completed;
    return true;
  });

  const StatusBadge = ({ completed }) => {
    const statusClass = completed
      ? styles.statusCompleted
      : styles.statusPending;
    const statusLabel = completed ? "Completed" : "Pending";
    return (
      <span className={`${styles.status} ${statusClass}`}>{statusLabel}</span>
    );
  };

  return (
    <section className={styles.maintenanceList}>
      <h2>Requests</h2>

      {filteredRequests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        <>
          {filteredRequests.map((req) => (
            <div key={req.id} className={styles.maintenanceCard}>
              <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                  <p>
                    <strong>Unit: </strong> {req.unit_number}
                  </p>
                  <p>
                    <strong>Issue: </strong> {req.information}
                  </p>
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
                  {req.completed && req.completed_at && (
                    <p>
                      <strong>Completed On: </strong>
                      {new Date(req.completed_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <StatusBadge completed={req.completed} />
              </div>

              {req.photos?.length > 0 && (
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

              <div className={styles.cardFooter}>
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => setSelectedRequest(req)}
                >
                  View / Edit
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
