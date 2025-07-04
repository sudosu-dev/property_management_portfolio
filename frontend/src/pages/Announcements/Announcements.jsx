import { useState, useEffect } from "react";
import useQuery from "../../api/useQuery";
import styles from "./Announcements.module.css";
import TenantSubmissionModal from "./TenantSubmissionModal";

function AnnouncementsCard({ announcement }) {
  const typeClassMap = {
    maintenance: styles.typeMaintenance,
    urgent: styles.typeUrgent,
    community: styles.typeCommunity,
  };
  const typeClass =
    typeClassMap[announcement.announcement_type.toLowerCase()] || "";

  return (
    <li className={`${styles.announcementsCard} ${typeClass}`}>
      <div className={styles.announcementsCardHeader}>
        <h3>{announcement.announcement_type}</h3>
        <span className={styles.date}>
          {new Date(announcement.publish_at).toLocaleDateString()}
        </span>
      </div>
      <p className={styles.announcementsCardContent}>
        {announcement.announcement}
      </p>
      <p className={styles.announcementsCardInfo}>
        Posted by {announcement.first_name} {announcement.last_name}
      </p>
    </li>
  );
}

export default function Announcements() {
  const {
    data: announcements,
    loading,
    error,
  } = useQuery("/announcements", "publicAnnouncements");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSuccess = () => {
    setSuccessMessage("Your announcement has been submitted for review!");
  };

  if (loading)
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <p>Error loading announcements: {error}</p>
        </div>
      </div>
    );

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.announcementsHeader}>Community Board</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsModalOpen(true)}
            aria-label="Suggest a new announcement for review"
          >
            + Suggest a Post
          </button>
        </div>

        {successMessage && (
          <div
            className={styles.successMessage}
            role="alert"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}

        <div className={styles.listContainer}>
          {announcements && announcements.length > 0 ? (
            <ul className={styles.announcementsList} role="list">
              {announcements.map((item) => (
                <AnnouncementsCard key={item.id} announcement={item} />
              ))}
            </ul>
          ) : (
            <p className={styles.noAnnouncements}>
              There are no announcements at this time.
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TenantSubmissionModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
