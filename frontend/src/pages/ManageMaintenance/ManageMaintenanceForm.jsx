import { useRef, useEffect } from "react";
import styles from "./ManageMaintenance.module.css";

export default function ManageMaintenanceForm({
  units,
  formData,
  setFormData,
  handleSubmit,
  message,
  fileReset,
  onClose,
}) {
  const firstInputRef = useRef(null);

  // Focus management - focus first input when modal opens
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    // Handle escape key
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
          aria-label="Close maintenance request form"
          type="button"
        >
          &times;
        </button>

        <h2 id="modal-title">Submit New Maintenance Request</h2>
        <p id="modal-description" className={styles.modalDescription}>
          Submit a maintenance request for any unit in the property
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="unit-select" className={styles.formLabel}>
              Unit *
            </label>
            <select
              id="unit-select"
              value={formData.unit_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unit_number: Number(e.target.value),
                })
              }
              className={styles.formSelect}
              required
              ref={firstInputRef}
              aria-describedby="unit-help"
            >
              <option value="">--Select a Unit--</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  Unit {unit.unit_number}
                </option>
              ))}
            </select>
            <span id="unit-help" className={styles.helpText}>
              Choose the unit that needs maintenance
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="issue-description" className={styles.formLabel}>
              Issue Description *
            </label>
            <textarea
              id="issue-description"
              className={styles.formTextarea}
              value={formData.information}
              name="information"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              required
              placeholder="Please describe the maintenance issue in detail..."
              rows={4}
              aria-describedby="issue-help"
            />
            <span id="issue-help" className={styles.helpText}>
              Provide as much detail as possible about the maintenance issue
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="maintenance-photos" className={styles.formLabel}>
              Photos (Optional)
            </label>
            <input
              id="maintenance-photos"
              type="file"
              name="maintenance_photos"
              multiple
              accept="image/*"
              ref={fileReset}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  files: Array.from(e.target.files),
                })
              }
              className={styles.formInput}
              aria-describedby="photos-help"
            />
            <span id="photos-help" className={styles.helpText}>
              Upload photos to help explain the issue (optional)
            </span>
          </div>

          {message && (
            <div
              className={styles.statusMessage}
              role="alert"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              aria-label="Cancel and close form without saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              aria-label="Submit maintenance request"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
