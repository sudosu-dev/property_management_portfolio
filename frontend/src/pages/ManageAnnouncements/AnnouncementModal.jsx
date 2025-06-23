import { useState, useEffect } from "react";
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? "Edit Announcement" : "Create New Announcement"}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="announcement_type">Type</label>
            <select
              id="announcement_type"
              name="announcement_type"
              value={formData.announcement_type}
              onChange={handleInputChange}
            >
              <option value="General">General</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Community">Community Event</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="announcement">Message</label>
            <textarea
              id="announcement"
              name="announcement"
              rows="5"
              value={formData.announcement}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="publish_at">Schedule Publication (Optional)</label>
            <input
              id="publish_at"
              name="publish_at"
              type="datetime-local"
              value={formData.publish_at}
              onChange={handleInputChange}
            />
            <small>Leave blank to publish immediately.</small>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

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
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
