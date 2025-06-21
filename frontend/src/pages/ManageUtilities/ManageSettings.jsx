// frontend/src/pages/ManagerSettings/ManagerSettings.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";
import { useApi } from "../../api/ApiContext";
import styles from "./ManageSettings.module.css";

export default function ManagerSettings() {
  const navigate = useNavigate();
  const { request, invalidateTags } = useApi();
  const { data: settings, loading } = useQuery("/settings", "settings");

  const [formState, setFormState] = useState({
    rate_water: "",
    rate_electric: "",
    rate_gas: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (settings) {
      setFormState({
        rate_water: settings.rate_water || "",
        rate_electric: settings.rate_electric || "",
        rate_gas: settings.rate_gas || "",
      });
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await request("/settings", {
        method: "PUT",
        body: JSON.stringify(formState),
      });

      setMessage({
        type: "success",
        text: "Settings updated successfully! Redirecting...",
      });
      invalidateTags(["settings"]);

      setTimeout(() => {
        navigate("/admin/utilities");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to update settings: ${error.message}`,
      });
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Manage Utility Rates</h1>
      </header>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="rate_water">Water Rate ($ / gallon)</label>
            <input
              id="rate_water"
              name="rate_water"
              type="number"
              step="0.001"
              value={formState.rate_water}
              onChange={handleInputChange}
            />
            <p className={styles.description}>The cost per gallon of water.</p>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rate_electric">Electric Rate ($ / kWh)</label>
            <input
              id="rate_electric"
              name="rate_electric"
              type="number"
              step="0.001"
              value={formState.rate_electric}
              onChange={handleInputChange}
            />
            <p className={styles.description}>
              The cost per kilowatt-hour of electricity.
            </p>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rate_gas">Gas Rate ($ / therm)</label>
            <input
              id="rate_gas"
              name="rate_gas"
              type="number"
              step="0.01"
              value={formState.rate_gas}
              onChange={handleInputChange}
            />
            <p className={styles.description}>
              The cost per therm of natural gas.
            </p>
          </div>
          <div className={styles.submitContainer}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
