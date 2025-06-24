import styles from "./ManageMaintenance.module.css";

export default function ManageMaintenanceForm({
  units,
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
