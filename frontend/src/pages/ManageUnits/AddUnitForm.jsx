import styles from "./ManageUnits.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { useNotifications } from "../../Context/NotificationContext";

export default function AddUnitForm() {
  const [propertyId, setPropertyId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [tenants, setTenants] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { token } = useAuth();
  const { showError, showSuccess } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!propertyId) {
      setError("Property ID is required");
      setIsSubmitting(false);
      return;
    }

    if (!unitNumber) {
      setError("Unit number is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API}/units`,
        {
          propertyId: Number(propertyId),
          unitNumber: unitNumber,
          rentAmount: rentAmount === "" ? null : Number(rentAmount),
          notes: notes === "" ? null : notes,
          tenants: tenants === "" ? null : tenants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      showSuccess(`Unit ${unitNumber} created successfully!`);
      navigate("/admin/units");
    } catch (error) {
      console.error("Error submitting unit form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create unit";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/units");
  };

  return (
    <div className={styles.page}>
      <header className={styles.formHeader}>
        <h1>Add New Unit</h1>
        <p className={styles.formDescription}>
          Enter the details for your new unit below
        </p>
      </header>

      <main className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.addUnitForm} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="propertyId" className={styles.formLabel}>
              Property ID *
            </label>
            <input
              id="propertyId"
              type="number"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className={styles.formInput}
              required
              aria-describedby={error ? "form-error" : undefined}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="unitNumber" className={styles.formLabel}>
              Unit Number *
            </label>
            <input
              id="unitNumber"
              type="text"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              className={styles.formInput}
              required
              aria-describedby={error ? "form-error" : undefined}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rentAmount" className={styles.formLabel}>
              Rent Amount
            </label>
            <input
              id="rentAmount"
              type="number"
              step="0.01"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              className={styles.formInput}
              placeholder="e.g., 1200.00"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.formLabel}>
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.formTextarea}
              rows="3"
              placeholder="Any additional notes about this unit..."
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tenants" className={styles.formLabel}>
              Tenants
            </label>
            <input
              id="tenants"
              type="text"
              value={tenants}
              onChange={(e) => setTenants(e.target.value)}
              className={styles.formInput}
              placeholder="Current tenant names"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div id="form-error" className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleBack}
              disabled={isSubmitting}
              aria-label="Cancel and return to units list"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
              aria-label="Submit new unit information"
            >
              {isSubmitting ? "Creating Unit..." : "Create Unit"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
