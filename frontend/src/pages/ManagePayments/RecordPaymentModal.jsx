import { useState, useEffect, useRef } from "react";
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
  const firstInputRef = useRef(null);

  // Focus management - focus first input when modal opens
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    // Handle escape key and trap focus
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
    setPaymentData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
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
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>

        <h2 id="modal-title">
          Record Offline Payment for {tenant.first_name} {tenant.last_name}
        </h2>
        <p id="modal-description" className={styles.modalDescription}>
          Unit {tenant.unit_number} - Record a payment made outside the system
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="payment-amount">Payment Amount ($) *</label>
            <input
              id="payment-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              className={styles.formInput}
              value={paymentData.amount}
              onChange={handleInputChange}
              required
              ref={firstInputRef}
              aria-describedby={error ? "form-error" : "amount-help"}
              disabled={isSubmitting}
            />
            <span id="amount-help" className={styles.helpText}>
              Enter the payment amount in dollars
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="payment-type">Payment Type *</label>
            <select
              id="payment-type"
              name="type"
              value={paymentData.type}
              onChange={handleInputChange}
              className={styles.formSelect}
              disabled={isSubmitting}
              aria-describedby="type-help"
            >
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="Money Order">Money Order</option>
              <option value="Other">Other</option>
            </select>
            <span id="type-help" className={styles.helpText}>
              Select how the payment was made
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="payment-description">
              Memo / Check # (Optional)
            </label>
            <textarea
              id="payment-description"
              name="description"
              rows="3"
              value={paymentData.description}
              onChange={handleInputChange}
              className={styles.formTextarea}
              placeholder="Check number, memo, or other notes..."
              aria-describedby="description-help"
              disabled={isSubmitting}
            />
            <span id="description-help" className={styles.helpText}>
              Optional: Add check number, memo, or other payment details
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
              aria-label="Cancel and close modal without saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
              aria-label={`Record payment for ${tenant.first_name} ${tenant.last_name}`}
            >
              {isSubmitting ? "Recording Payment..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
