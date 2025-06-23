import { useState, useMemo } from "react";
import { useApi } from "../../api/ApiContext";
import useQuery from "../../api/useQuery";
import styles from "./ManageAnnouncements.module.css";

export default function ManageAnnouncements() {
  const { request } = useApi();
  const [filter, setFilter] = useState(""); // "", "pending", "approved", "rejected"

  const {
    data: announcements,
    loading,
    error,
    query: refetchAnnouncements,
  } = useQuery("/announcements", "allAnnouncements");

  // Memoized client-side filtering
  const filteredAnnouncements = useMemo(() => {
    if (!announcements) return [];
    if (!filter) return announcements;
    return announcements.filter((a) => a.status === filter);
  }, [announcements, filter]);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this post?`)) {
      return;
    }
    try {
      // Using the raw request from context, same as in ManagePayments modal
      await request(`/announcements/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      refetchAnnouncements(); // Refetch the list after a successful update
    } catch (err) {
      console.error(err);
      alert(`Failed to ${newStatus} announcement: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this post?")
    ) {
      return;
    }
    try {
      await request(`/announcements/${id}`, { method: "DELETE" });
      refetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert(`Failed to delete announcement: ${err.message}`);
    }
  };

  // Reusable components for this page
  const StatusBadge = ({ status }) => {
    const statusClass =
      {
        pending: styles.statusPending,
        approved: styles.statusApproved,
        rejected: styles.statusRejected,
      }[status] || "";
    return <span className={`${styles.status} ${statusClass}`}>{status}</span>;
  };

  const FilterButton = ({ status, label }) => (
    <button
      className={`${styles.filterButton} ${
        filter === status ? styles.active : ""
      }`}
      onClick={() => setFilter(status)}
    >
      {label}
    </button>
  );

  if (loading)
    return (
      <div className={styles.page}>
        <p>Loading announcements...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.page}>
        <p>Error loading announcements: {error}</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Manage Announcements</h1>
        <p>Review, approve, and manage all tenant and staff announcements.</p>
      </header>

      <div className={styles.mainContent}>
        <aside className={styles.filters}>
          <FilterButton status="" label="All" />
          <FilterButton status="pending" label="Pending Review" />
          <FilterButton status="approved" label="Approved" />
          <FilterButton status="rejected" label="Rejected" />
        </aside>

        <main className={styles.announcementsList}>
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((ann) => (
              <div key={ann.id} className={styles.announcementCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.authorInfo}>
                    <p>
                      <strong>Author:</strong> {ann.first_name} {ann.last_name}
                      <br />
                      <strong>Scheduled:</strong>{" "}
                      {new Date(ann.publish_at).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={ann.status} />
                </div>
                <p className={styles.announcementBody}>{ann.announcement}</p>
                <div className={styles.cardFooter}>
                  {ann.status === "pending" && (
                    <>
                      <button
                        className={`${styles.actionButton} ${styles.approveButton}`}
                        onClick={() => handleStatusChange(ann.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                        onClick={() => handleStatusChange(ann.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(ann.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No announcements match the current filter.</p>
          )}
        </main>
      </div>
    </div>
  );
}
