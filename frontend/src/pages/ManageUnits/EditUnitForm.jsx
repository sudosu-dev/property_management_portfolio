import styles from "./ManageUnits.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { useNotifications } from "../../Context/NotificationContext";

export default function EditUnitForm() {
  const [propertyId, setPropertyId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [tenants, setTenants] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showError, showSuccess } = useNotifications();

  // Fetch existing unit info on mount
  useEffect(() => {
    async function fetchUnit() {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/units/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const { property_id, unit_number, rent_amount, notes, tenants } =
          response.data;

        setPropertyId(property_id ? property_id.toString() : "");
        setUnitNumber(unit_number || "");
        setRentAmount(rent_amount ? rent_amount.toString() : "");
        setNotes(notes || "");
        setTenants(tenants || "");
      } catch (error) {
        console.error("Error fetching unit:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to load unit";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (id && token) {
      fetchUnit();
    }
  }, [id, token, showError]);

  // Handle PATCH request to update unit
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
      const response = await axios.patch(
        `${API}/units/${id}`,
        {
          property_id: Number(propertyId),
          unit_number: unitNumber,
          rent_amount: rentAmount === "" ? null : Number(rentAmount),
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

      console.log("Unit updated:", response.data);
      showSuccess(`Unit ${unitNumber} updated successfully!`);
      navigate("/admin/units");
    } catch (error) {
      console.error("Error updating unit:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update unit";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading unit information"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading unit information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.formHeader}>
        <h1>Edit Unit</h1>
        <p className={styles.formDescription}>
          Update the unit information below
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
              onClick={() => navigate("/admin/units")}
              disabled={isSubmitting}
              aria-label="Cancel and return to units list"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
              aria-label="Save unit changes"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
