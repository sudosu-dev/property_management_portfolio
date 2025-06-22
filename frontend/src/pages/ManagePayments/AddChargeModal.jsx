import { useState } from "react";
import { useApi } from "../../api/ApiContext";
import styles from "./ManagePayments.module.css";

export default function AddChargeModal({ tenant, onClose, onSuccess }) {
  const { request } = useApi();
  const [chargeData, setChargeData] = useState({
    amount: "",
    type: "Late Fee",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChargeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(chargeData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (!chargeData.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        userId: tenant.user_id,
        unitId: tenant.unit_id,
        amount: amount,
        type: chargeData.type,
        description: chargeData.description,
      };

      await request("/transactions/charge", {
        method: "POST",
        body: JSON.stringify(body),
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>
          Add Charge for {tenant.first_name} {tenant.last_name} (Unit{" "}
          {tenant.unit_number})
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="amount">Amount ($)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              className={styles.searchInput}
              value={chargeData.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="type">Charge Type</label>
            <select
              id="type"
              name="type"
              value={chargeData.type}
              onChange={handleInputChange}
            >
              <option value="Late Fee">Late Fee</option>
              <option value="Damage Fee">Damage Fee</option>
              <option value="Parking Fee">Parking Fee</option>
              <option value="Misc Charge">Misc. Charge</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={chargeData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Charge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
