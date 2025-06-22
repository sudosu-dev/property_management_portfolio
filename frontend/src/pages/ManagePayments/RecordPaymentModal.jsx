import { useState } from "react";
import { useApi } from "../../api/ApiContext";
import styles from "./ManagePayments.module.css";

export default function RecordPaymentModal({ tenant, onClose, onSuccess }) {
  const { request } = useApi();
  const [paymentData, setPaymentData] = useState({
    amount: "",
    type: "Check",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        userId: tenant.user_id,
        unitId: tenant.unit_id,
        amount: amount,
        type: paymentData.type,
        description: paymentData.description || `Offline payment recorded`,
      };

      await request("/transactions/record-payment", {
        method: "POST",
        body: JSON.stringify(body),
      });

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
        <h2>
          Record Offline Payment for {tenant.first_name} {tenant.last_name}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="amount">Payment Amount ($)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              className={styles.searchInput}
              value={paymentData.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="type">Payment Type</label>
            <select
              id="type"
              name="type"
              value={paymentData.type}
              onChange={handleInputChange}
            >
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="Money Order">Money Order</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Memo / Check #</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={paymentData.description}
              onChange={handleInputChange}
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
              {isSubmitting ? "Submitting..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
