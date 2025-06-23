import styles from "./ManageMaintenance.module.css";

export default function MaintenanceForm({
  formData,
  setFormData,
  handleSubmit,
  message,
  fileReset,
}) {
  return (
    <section className={styles.newRequests}>
      <h2>Make New Maintenance Request</h2>
      <div className={styles.requestForm}>
        <form onSubmit={handleSubmit}>
          <label>
            <strong>Unit: </strong>
            <input
              type="number"
              name="unit"
              value={formData.unit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            <strong>Issue: </strong>
            <br />
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
          <br />
          <label>
            <strong>Photos: </strong>
            <br />
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
          <br />
          <button type="submit">Submit Request</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </section>
  );
}
