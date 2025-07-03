import { useState, useMemo } from "react";
import { useApi } from "../../api/ApiContext";
import useQuery from "../../api/useQuery";
import styles from "./ManageAnnouncements.module.css";
import AnnouncementModal from "./AnnouncementModal";
import { useNotifications } from "../../Context/NotificationContext";

export default function ManageAnnouncements() {
  const { showError } = useNotifications();
  const { request } = useApi();
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null); // To hold the announcement being edited

  const {
    data: announcements,
    loading,
    error,
    query: refetchAnnouncements,
  } = useQuery("/announcements", "allAnnouncements");

  const filteredAnnouncements = useMemo(() => {
    if (!announcements) return [];
    if (!filter) return announcements;
    return announcements.filter((a) => a.status === filter);
  }, [announcements, filter]);

  const handleOpenCreateModal = () => {
    setEditingAnn(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (announcement) => {
    setEditingAnn(announcement);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this post?`)) {
      return;
    }
    try {
      await request(`/announcements/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      refetchAnnouncements();
    } catch (err) {
      console.error(err);
      showError(`Failed to ${newStatus} announcement: ${err.message}`);
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
      showError(`Failed to delete announcement: ${err.message}`);
    }
  };

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
    <>
      <div className={styles.page}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Manage Announcements</h1>
            <p>
              Review, approve, and manage all tenant and staff announcements.
            </p>
          </header>

          <div className={styles.controls}>
            <button
              className={styles.primaryButton}
              onClick={handleOpenCreateModal}
            >
              + Create New Announcement
            </button>
          </div>

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
                          <strong>Author:</strong> {ann.first_name}{" "}
                          {ann.last_name}
                          <br />
                          <strong>Scheduled:</strong>{" "}
                          {new Date(ann.publish_at).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={ann.status} />
                    </div>
                    <p className={styles.announcementBody}>
                      {ann.announcement}
                    </p>
                    <div className={styles.cardFooter}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleOpenEditModal(ann)}
                      >
                        Edit
                      </button>
                      {ann.status === "pending" && (
                        <>
                          <button
                            className={`${styles.actionButton} ${styles.approveButton}`}
                            onClick={() =>
                              handleStatusChange(ann.id, "approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.rejectButton}`}
                            onClick={() =>
                              handleStatusChange(ann.id, "rejected")
                            }
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
      </div>
      {isModalOpen && (
        <AnnouncementModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={refetchAnnouncements}
          announcementToEdit={editingAnn}
        />
      )}
    </>
  );
}
