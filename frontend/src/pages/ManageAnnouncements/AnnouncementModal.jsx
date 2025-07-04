import { useState, useEffect, useRef } from "react";
import { useApi } from "../../api/ApiContext";
import styles from "./ManageAnnouncements.module.css";

export default function AnnouncementModal({
  onClose,
  onSuccess,
  announcementToEdit = null,
}) {
  const { request } = useApi();
  const [formData, setFormData] = useState({
    announcement: "",
    announcement_type: "General",
    publish_at: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const firstInputRef = useRef(null);

  const isEditMode = announcementToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        announcement: announcementToEdit.announcement,
        announcement_type: announcementToEdit.announcement_type,
        // Format for datetime-local input, removing seconds/milliseconds
        publish_at: announcementToEdit.publish_at
          ? new Date(announcementToEdit.publish_at).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [announcementToEdit, isEditMode]);

  // Focus management
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.announcement.trim()) {
      setError("Announcement message is required.");
      return;
    }

    setIsSubmitting(true);

    const body = {
      ...formData,
      // Convert to UTC ISO string for backend, or null if empty
      publish_at: formData.publish_at
        ? new Date(formData.publish_at).toISOString()
        : null,
    };

    try {
      if (isEditMode) {
        // We need to use the original PUT route and function for editing
        const editBody = {
          ...body,
          date: new Date(body.publish_at || Date.now()),
        };
        await request(`/announcements/${announcementToEdit.id}`, {
          method: "PUT",
          body: JSON.stringify(editBody),
        });
      } else {
        await request("/announcements", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close announcement form"
          type="button"
        >
          &times;
        </button>

        <h2 id="modal-title">
          {isEditMode ? "Edit Announcement" : "Create New Announcement"}
        </h2>
        <p id="modal-description" className={styles.modalDescription}>
          {isEditMode
            ? "Update the announcement details below"
            : "Create a new announcement to share with residents"}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="announcement_type" className={styles.formLabel}>
              Announcement Type *
            </label>
            <select
              id="announcement_type"
              name="announcement_type"
              value={formData.announcement_type}
              onChange={handleInputChange}
              className={styles.formSelect}
              required
              ref={firstInputRef}
              disabled={isSubmitting}
              aria-describedby="type-help"
            >
              <option value="General">General</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Community">Community Event</option>
              <option value="Urgent">Urgent</option>
            </select>
            <span id="type-help" className={styles.helpText}>
              Choose the category that best describes this announcement
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="announcement" className={styles.formLabel}>
              Announcement Message *
            </label>
            <textarea
              id="announcement"
              name="announcement"
              rows="5"
              value={formData.announcement}
              onChange={handleInputChange}
              className={styles.formTextarea}
              required
              placeholder="Enter your announcement message here..."
              aria-describedby={error ? "form-error" : "message-help"}
              disabled={isSubmitting}
            />
            <span id="message-help" className={styles.helpText}>
              Write a clear and informative message for residents
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="publish_at" className={styles.formLabel}>
              Schedule Publication (Optional)
            </label>
            <input
              id="publish_at"
              name="publish_at"
              type="datetime-local"
              value={formData.publish_at}
              onChange={handleInputChange}
              className={styles.formInput}
              min={getCurrentDateTime()}
              disabled={isSubmitting}
              aria-describedby="schedule-help"
            />
            <span id="schedule-help" className={styles.helpText}>
              Leave blank to publish immediately, or set a future date and time
            </span>
          </div>

          {error && (
            <div
              id="form-error"
              className={styles.errorMessage}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Cancel and close form without saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
              aria-label={`${
                isEditMode ? "Save changes to" : "Create"
              } announcement`}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
