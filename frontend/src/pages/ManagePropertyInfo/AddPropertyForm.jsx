import styles from "./ManagePropertyInfo.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { useNotifications } from "../../Context/NotificationContext";

export default function AddPropertyForm() {
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { token } = useAuth();
  const { showError, showSuccess } = useNotifications();

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
      const response = await axios.post(
        `${API}/properties`,
        {
          propertyName: propertyName.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim() || null,
          totalUnits: totalUnits ? parseInt(totalUnits) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      showSuccess(`Property "${propertyName}" added successfully!`);
      navigate("/admin/propertyinfo");
    } catch (error) {
      console.error("Error submitting property form:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add property";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.formHeader}>
        <h1>Add New Property</h1>
        <p className={styles.formDescription}>
          Enter the details for your new property below
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
              aria-label="Submit new property information"
            >
              {isSubmitting ? "Adding Property..." : "Add Property"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
