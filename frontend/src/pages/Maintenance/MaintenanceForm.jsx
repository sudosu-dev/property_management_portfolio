import styles from "./Maintenance.module.css";

export default function MaintenanceForm({
  user,
  formData,
  setFormData,
  handleSubmit,
  message,
  fileReset,
  onClose,
}) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Submit New Maintenance Request</h2>
        <div className={styles.userInfo}>
          <p>
            <span>Name:</span> {`${user?.first_name} ${user?.last_name}`}
          </p>
          <p>
            <span>Unit: </span> {`${user?.unit_number}`}
          </p>
          <p>
            <span>Email: </span> {`${user?.email}`}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>
              <span>Issue: </span>
              <textarea
                value={formData.information}
                type="text"
                name="information"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
                placeholder="Please describe the issue..."
                rows={4}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              <span>Photos: </span>
              <input
                type="file"
                name="maintenance_photos"
                multiple
                ref={fileReset}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    files: Array.from(e.target.files),
                  })
                }
              />
            </label>
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              Submit Request
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
