import { useState } from "react";
import styles from "./ManageMaintenance.module.css";
import { API } from "../../api/ApiContext";

export default function ManageRequestList({
  requests,
  showAll,
  setShowAll,
  setSelectedRequest,
}) {
  const [filter, setFilter] = useState("Pending");
  const filteredRequests = requests.filter((req) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !req.completed;
    if (filter === "Completed") return req.completed;
    return true;
  });

  return (
    <section className={styles.activeRequests}>
      <h2>Requests</h2>
      <label className={styles.filter}>Filter by Status: </label>
      <select
        className={styles.filterSelect}
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
      {filteredRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul>
          {(showAll ? filteredRequests : filteredRequests.slice(0, 2)).map(
            (req) => (
              <li key={req.id} onClick={() => setSelectedRequest(req)}>
                <p>
                  <strong>Unit: </strong>
                  {req.unit_number}
                </p>
                <p>
                  <strong>Issue: </strong>
                  {req.information}
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
                <p>
                  <strong>Status: </strong>
                  {req.completed ? "Completed" : "Pending"}
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
                {req.photos && req.photos.length > 0 && (
                  <div className={styles.photos}>
                    {req.photos.map((photo) => {
                      const url = `${API}/${photo.photo_url.replace(
                        /\\/g,
                        `/`
                      )}`;
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
            )
          )}
          {filteredRequests.length > 2 && (
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
