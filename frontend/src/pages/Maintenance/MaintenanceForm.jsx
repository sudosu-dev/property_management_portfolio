import styles from "./Maintenance.module.css";

export default function MaintenanceForm({
  user,
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
        <div className={styles.info}>
          <p>
            <strong>Name:</strong> {`${user?.first_name} ${user?.last_name}`}
          </p>
          <p>
            <strong>Unit: </strong> {`${user?.unit_number}`}
          </p>
          <p>
            <strong>Email: </strong> {`${user?.email}`}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
          <button type="submit">Submit Request</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </section>
  );
}
