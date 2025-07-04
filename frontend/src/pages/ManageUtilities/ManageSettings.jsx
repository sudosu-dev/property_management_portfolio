import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";
import { useApi } from "../../api/ApiContext";
import { useNotifications } from "../../Context/NotificationContext";
import styles from "./ManageSettings.module.css";

export default function ManageSettings() {
  const navigate = useNavigate();
  const { request, invalidateTags } = useApi();
  const { data: settings, loading, error } = useQuery("/settings", "settings");
  const { showError, showSuccess } = useNotifications();

  const [formState, setFormState] = useState({
    rate_water: "",
    rate_electric: "",
    rate_gas: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (settings) {
      setFormState({
        rate_water: settings.rate_water || "",
        rate_electric: settings.rate_electric || "",
        rate_gas: settings.rate_gas || "",
      });
    }
  }, [settings]);

  // Clear success message after delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        // Navigate after user has time to read the message
        navigate("/admin/utilities");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (formError) setFormError("");
  };

  const validateForm = () => {
    const waterRate = parseFloat(formState.rate_water);
    const electricRate = parseFloat(formState.rate_electric);
    const gasRate = parseFloat(formState.rate_gas);

    if (isNaN(waterRate) || waterRate < 0) {
      setFormError("Water rate must be a valid positive number.");
      return false;
    }
    if (isNaN(electricRate) || electricRate < 0) {
      setFormError("Electric rate must be a valid positive number.");
      return false;
    }
    if (isNaN(gasRate) || gasRate < 0) {
      setFormError("Gas rate must be a valid positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await request("/settings", {
        method: "PUT",
        body: JSON.stringify(formState),
      });

      invalidateTags(["settings"]);
      setSuccessMessage("Utility rates updated successfully! Redirecting...");
      showSuccess("Utility rates updated successfully!");
    } catch (error) {
      const errorMessage = `Failed to update settings: ${error.message}`;
      setFormError(errorMessage);
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
          aria-label="Loading utility settings"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading utility settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Error Loading Settings</h1>
          <p>Unable to load utility settings: {error}</p>
          <button
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
            aria-label="Reload the page to try again"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Manage Utility Rates</h1>
        <p className={styles.description}>
          Set the cost per unit for water, electricity, and gas to calculate
          monthly utility bills
        </p>
      </header>

      <main className={styles.content}>
        {successMessage && (
          <div
            className={styles.successMessage}
            role="alert"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formContent}>
              <div className={styles.formGroup}>
                <label htmlFor="rate_water" className={styles.formLabel}>
                  Water Rate ($ per gallon) *
                </label>
                <input
                  id="rate_water"
                  name="rate_water"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formState.rate_water}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  aria-describedby={formError ? "form-error" : "water-help"}
                  disabled={isSubmitting}
                />
                <span id="water-help" className={styles.helpText}>
                  The cost per gallon of water usage
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rate_electric" className={styles.formLabel}>
                  Electric Rate ($ per kWh) *
                </label>
                <input
                  id="rate_electric"
                  name="rate_electric"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formState.rate_electric}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  aria-describedby={formError ? "form-error" : "electric-help"}
                  disabled={isSubmitting}
                />
                <span id="electric-help" className={styles.helpText}>
                  The cost per kilowatt-hour of electricity usage
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rate_gas" className={styles.formLabel}>
                  Gas Rate ($ per therm) *
                </label>
                <input
                  id="rate_gas"
                  name="rate_gas"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formState.rate_gas}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  aria-describedby={formError ? "form-error" : "gas-help"}
                  disabled={isSubmitting}
                />
                <span id="gas-help" className={styles.helpText}>
                  The cost per therm of natural gas usage
                </span>
              </div>
            </div>

            {formError && (
              <div
                id="form-error"
                className={styles.errorMessage}
                role="alert"
                aria-live="polite"
              >
                {formError}
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate("/admin/utilities")}
                disabled={isSubmitting}
                aria-label="Cancel and return to utilities page"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
                aria-label="Save utility rate changes"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
