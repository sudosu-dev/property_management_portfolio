import { useState, useEffect, useRef } from "react";
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
  const firstInputRef = useRef(null);

  // Focus management - focus first input when modal opens
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    // Trap focus within modal
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
    setChargeData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
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
          Add Charge for {tenant.first_name} {tenant.last_name}
        </h2>
        <p id="modal-description" className={styles.modalDescription}>
          Unit {tenant.unit_number} - Add a new charge to this tenant's account
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="charge-amount">Amount ($) *</label>
            <input
              id="charge-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              className={styles.formInput}
              value={chargeData.amount}
              onChange={handleInputChange}
              required
              ref={firstInputRef}
              aria-describedby={error ? "form-error" : "amount-help"}
              disabled={isSubmitting}
            />
            <span id="amount-help" className={styles.helpText}>
              Enter the charge amount in dollars
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="charge-type">Charge Type *</label>
            <select
              id="charge-type"
              name="type"
              value={chargeData.type}
              onChange={handleInputChange}
              className={styles.formSelect}
              disabled={isSubmitting}
              aria-describedby="type-help"
            >
              <option value="Late Fee">Late Fee</option>
              <option value="Damage Fee">Damage Fee</option>
              <option value="Parking Fee">Parking Fee</option>
              <option value="Misc Charge">Misc. Charge</option>
            </select>
            <span id="type-help" className={styles.helpText}>
              Select the type of charge being applied
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="charge-description">Description *</label>
            <textarea
              id="charge-description"
              name="description"
              rows="3"
              value={chargeData.description}
              onChange={handleInputChange}
              className={styles.formTextarea}
              required
              placeholder="Describe the reason for this charge..."
              aria-describedby={error ? "form-error" : "description-help"}
              disabled={isSubmitting}
            />
            <span id="description-help" className={styles.helpText}>
              Provide details about why this charge is being applied
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
              aria-label={`Add charge to ${tenant.first_name} ${tenant.last_name}'s account`}
            >
              {isSubmitting ? "Adding Charge..." : "Add Charge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
