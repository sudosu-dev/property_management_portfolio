import { useState, useMemo, useEffect } from "react";
import { useApi } from "../../api/ApiContext";
import useQuery from "../../api/useQuery";
import styles from "./ManageAnnouncements.module.css";
import AnnouncementModal from "./AnnouncementModal";
import { useNotifications } from "../../Context/NotificationContext";

export default function ManageAnnouncements() {
  const { showError, showSuccess } = useNotifications();
  const { request } = useApi();
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: announcements,
    loading,
    error,
    query: refetchAnnouncements,
  } = useQuery("/announcements", "allAnnouncements");

  // Clear success message after delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnn(null);
  };

  const handleSuccess = () => {
    setSuccessMessage("Announcement updated successfully!");
    showSuccess("Announcement updated successfully!");
    refetchAnnouncements();
    handleCloseModal();
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
      setSuccessMessage(`Announcement ${newStatus} successfully!`);
      showSuccess(`Announcement ${newStatus} successfully!`);
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
      setSuccessMessage("Announcement deleted successfully!");
      showSuccess("Announcement deleted successfully!");
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
    return (
      <span
        className={`${styles.status} ${statusClass}`}
        aria-label={`Status: ${status}`}
      >
        {status}
      </span>
    );
  };

  const FilterButton = ({ status, label }) => (
    <button
      className={`${styles.filterButton} ${
        filter === status ? styles.active : ""
      }`}
      onClick={() => setFilter(status)}
      aria-label={`Filter by ${label.toLowerCase()}`}
      aria-pressed={filter === status}
    >
      {label}
    </button>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading announcements"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Error Loading Announcements</h1>
          <p>Unable to load announcements: {error}</p>
          <button
            className={styles.primaryButton}
            onClick={() => {
              refetchAnnouncements();
            }}
            aria-label="Retry loading announcements"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Manage Announcements</h1>
          <p className={styles.description}>
            Review, approve, and manage all tenant and staff announcements
          </p>
        </header>

        <main className={styles.content}>
          {successMessage && (
            <div
              className={styles.successMessage}
              role="alert"
              aria-live="polite"
            >
              {successMessage}
            </div>
          )}

          <div className={styles.controls}>
            <button
              className={styles.primaryButton}
              onClick={handleOpenCreateModal}
              aria-label="Open form to create new announcement"
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

            {/* Desktop Table View */}
            <div className={styles.desktopView}>
              <main className={styles.announcementsList}>
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((ann) => (
                    <article key={ann.id} className={styles.announcementCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.authorInfo}>
                          <p>
                            <strong>Author:</strong> {ann.first_name}{" "}
                            {ann.last_name}
                          </p>
                          <p>
                            <strong>Scheduled:</strong>{" "}
                            <time dateTime={ann.publish_at}>
                              {formatDate(ann.publish_at)}
                            </time>
                          </p>
                        </div>
                        <StatusBadge status={ann.status} />
                      </div>
                      <div className={styles.announcementBody}>
                        {ann.announcement}
                      </div>
                      <div className={styles.cardFooter}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleOpenEditModal(ann)}
                          aria-label={`Edit announcement by ${ann.first_name} ${ann.last_name}`}
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
                              aria-label={`Approve announcement by ${ann.first_name} ${ann.last_name}`}
                            >
                              Approve
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.rejectButton}`}
                              onClick={() =>
                                handleStatusChange(ann.id, "rejected")
                              }
                              aria-label={`Reject announcement by ${ann.first_name} ${ann.last_name}`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDelete(ann.id)}
                          aria-label={`Delete announcement by ${ann.first_name} ${ann.last_name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>No announcements match the current filter.</p>
                  </div>
                )}
              </main>
            </div>

            {/* Mobile Card View */}
            <div className={styles.mobileView}>
              {filteredAnnouncements.length > 0 ? (
                <ul className={styles.mobileAnnouncementsList} role="list">
                  {filteredAnnouncements.map((ann) => (
                    <li key={ann.id} className={styles.mobileAnnouncementCard}>
                      <div className={styles.mobileCardHeader}>
                        <div className={styles.mobileAuthorInfo}>
                          <h3>
                            {ann.first_name} {ann.last_name}
                          </h3>
                          <time
                            dateTime={ann.publish_at}
                            className={styles.mobileDate}
                          >
                            {formatDate(ann.publish_at)}
                          </time>
                        </div>
                        <StatusBadge status={ann.status} />
                      </div>

                      <div className={styles.mobileCardContent}>
                        <p className={styles.mobileAnnouncementText}>
                          {ann.announcement}
                        </p>
                      </div>

                      <div className={styles.mobileCardActions}>
                        <button
                          className={styles.mobileActionButton}
                          onClick={() => handleOpenEditModal(ann)}
                          aria-label={`Edit announcement by ${ann.first_name} ${ann.last_name}`}
                        >
                          Edit
                        </button>
                        {ann.status === "pending" && (
                          <>
                            <button
                              className={`${styles.mobileActionButton} ${styles.approveButton}`}
                              onClick={() =>
                                handleStatusChange(ann.id, "approved")
                              }
                              aria-label={`Approve announcement by ${ann.first_name} ${ann.last_name}`}
                            >
                              Approve
                            </button>
                            <button
                              className={`${styles.mobileActionButton} ${styles.rejectButton}`}
                              onClick={() =>
                                handleStatusChange(ann.id, "rejected")
                              }
                              aria-label={`Reject announcement by ${ann.first_name} ${ann.last_name}`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className={`${styles.mobileActionButton} ${styles.deleteButton}`}
                          onClick={() => handleDelete(ann.id)}
                          aria-label={`Delete announcement by ${ann.first_name} ${ann.last_name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.noAnnouncements}>
                  <p>No announcements match the current filter.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <AnnouncementModal
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          announcementToEdit={editingAnn}
        />
      )}
    </>
  );
}
