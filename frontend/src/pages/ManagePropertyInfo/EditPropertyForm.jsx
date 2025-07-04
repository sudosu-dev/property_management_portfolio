import styles from "./ManagePropertyInfo.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { useNotifications } from "../../Context/NotificationContext";

export default function EditPropertyForm() {
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showError, showSuccess } = useNotifications();

  // Fetch existing property info on mount
  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const { property_name, address, phone_number, total_units } =
          response.data;

        setPropertyName(property_name || "");
        setAddress(address || "");
        setPhoneNumber(phone_number || "");
        setTotalUnits(total_units ? total_units.toString() : "");
      } catch (error) {
        console.error("Error fetching property:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to load property";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (id && token) {
      fetchProperty();
    }
  }, [id, token, showError]);

  // Handle PATCH request to update property
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Basic validation
    if (!propertyName.trim()) {
      setError("Property name is required");
      setIsSubmitting(false);
      return;
    }

    if (!address.trim()) {
      setError("Property address is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API}/properties/${id}`,
        {
          property_name: propertyName.trim(),
          address: address.trim(),
          phone_number: phoneNumber.trim() || null,
          total_units: totalUnits ? parseInt(totalUnits) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Property updated:", response.data);
      showSuccess(`Property "${propertyName}" updated successfully!`);
      navigate("/admin/propertyinfo");
    } catch (error) {
      console.error("Error updating property:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update property";
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
          aria-label="Loading property information"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading property information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.formHeader}>
        <h1>Edit Property</h1>
        <p className={styles.formDescription}>
          Update the property information below
        </p>
      </header>

      <main className={styles.formContainer}>
        <form
          onSubmit={handleSubmit}
          className={styles.addPropertyForm}
          noValidate
        >
          <div className={styles.formGroup}>
            <label htmlFor="propertyName" className={styles.formLabel}>
              Property Name *
            </label>
            <input
              id="propertyName"
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              className={styles.formInput}
              required
              aria-describedby={error ? "form-error" : undefined}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.formLabel}>
              Property Address *
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.formInput}
              required
              aria-describedby={error ? "form-error" : undefined}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.formLabel}>
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.formInput}
              placeholder="(555) 123-4567"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="totalUnits" className={styles.formLabel}>
              Number of Units
            </label>
            <input
              id="totalUnits"
              type="number"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              className={styles.formInput}
              min="1"
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
              onClick={() => navigate("/admin/propertyinfo")}
              disabled={isSubmitting}
              aria-label="Cancel and return to properties list"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
              aria-label="Save property changes"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
