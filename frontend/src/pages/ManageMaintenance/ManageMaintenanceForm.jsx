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
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Submit New Maintenance Request</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>
              <strong>Unit: </strong>
              <select
                value={formData.unit_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit_number: Number(e.target.value),
                  })
                }
                required
              >
                <option value="">--Select a Unit--</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_number}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>
              <strong>Issue: </strong>
              <textarea
                className={styles.textBox}
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
              <strong>Photos: </strong>
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
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
