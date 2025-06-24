import { useState } from "react";
import { useApi } from "../../api/ApiContext";
import styles from "./Announcements.module.css";

export default function TenantSubmissionModal({ onClose, onSuccess }) {
  const { request } = useApi();
  const [announcementText, setAnnouncementText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) {
      setError("Please enter a message for your announcement.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await request("/announcements/submit", {
        method: "POST",
        body: JSON.stringify({
          announcement: announcementText,
          announcement_type: "General", // Default type for tenant submissions
        }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Suggest an Announcement</h2>
        <p>
          Your post will be submitted to management for review before it is
          shared.
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="announcement">Your Message</label>
            <textarea
              id="announcement"
              name="announcement"
              rows="5"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              required
            ></textarea>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
