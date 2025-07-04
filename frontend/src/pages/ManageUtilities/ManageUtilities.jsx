import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";
import { useApi } from "../../api/ApiContext";
import { useNotifications } from "../../Context/NotificationContext";
import styles from "./ManageUtilities.module.css";

export default function ManageUtilities() {
  const navigate = useNavigate();
  const { request } = useApi();
  const {
    data: units,
    loading: loadingUnits,
    error: errorUnits,
  } = useQuery("/units", "units");
  const {
    data: settings,
    loading: loadingSettings,
    error: errorSettings,
  } = useQuery("/settings", "settings");
  const [utilityData, setUtilityData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { showError, showSuccess } = useNotifications();

  const utilityRates = {
    water: settings?.rate_water || 0,
    electric: settings?.rate_electric || 0,
    gas: settings?.rate_gas || 0,
  };

  const isLoading = loadingUnits || loadingSettings;
  const error = errorUnits || errorSettings;

  useEffect(() => {
    if (units) {
      const initialData = {};
      units.forEach((unit) => {
        if (unit.tenant_info?.id) {
          initialData[unit.id] = {
            water_usage: "",
            electric_usage: "",
            gas_usage: "",
          };
        }
      });
      setUtilityData(initialData);
    }
  }, [units]);

  // Clear success message after delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (unitId, field, value) => {
    setUtilityData((prevData) => ({
      ...prevData,
      [unitId]: {
        ...prevData[unitId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const billsToCreate = Object.entries(utilityData)
      .map(([unitId, data]) => {
        const unit = units.find((u) => u.id === parseInt(unitId));
        const waterUsage = parseFloat(data.water_usage);
        const electricUsage = parseFloat(data.electric_usage);
        const gasUsage = parseFloat(data.gas_usage);

        if (
          !unit?.tenant_info?.id ||
          (!waterUsage && !electricUsage && !gasUsage)
        ) {
          return null;
        }

        return {
          user_id: unit.tenant_info.id,
          water_usage: waterUsage || null,
          electric_usage: electricUsage || null,
          gas_usage: gasUsage || null,
          water_cost: waterUsage
            ? (waterUsage * utilityRates.water).toFixed(2)
            : null,
          electric_cost: electricUsage
            ? (electricUsage * utilityRates.electric).toFixed(2)
            : null,
          gas_cost: gasUsage ? (gasUsage * utilityRates.gas).toFixed(2) : null,
          due_date: new Date().toISOString().split("T")[0],
        };
      })
      .filter(Boolean);

    if (billsToCreate.length === 0) {
      showError("Please enter usage data for at least one unit.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await request("/utilities", {
        method: "POST",
        body: JSON.stringify(billsToCreate),
      });
      setSuccessMessage(
        `Successfully created ${billsToCreate.length} utility bill(s)!`
      );
      showSuccess(
        `Successfully created ${billsToCreate.length} utility bill(s)!`
      );

      // Clear form data
      const clearedData = {};
      units.forEach((unit) => {
        if (unit.tenant_info?.id) {
          clearedData[unit.id] = {
            water_usage: "",
            electric_usage: "",
            gas_usage: "",
          };
        }
      });
      setUtilityData(clearedData);
    } catch (error) {
      showError(`Failed to create utility bills: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading utility data"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading utility data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Error Loading Data</h1>
          <p>Unable to load utility data: {error}</p>
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

  const occupiedUnits = units?.filter((unit) => unit.tenant_info?.id) || [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Enter Monthly Utility Readings</h1>
        <p className={styles.description}>
          Record water, electric, and gas usage for all occupied units to
          generate monthly utility bills
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

        <div className={styles.ratesSection}>
          <h2>Current Utility Rates</h2>
          <div className={styles.ratesDisplay}>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Water:</span>
              <span className={styles.rateValue}>
                ${utilityRates.water}/gallon
              </span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Electric:</span>
              <span className={styles.rateValue}>
                ${utilityRates.electric}/kWh
              </span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Gas:</span>
              <span className={styles.rateValue}>
                ${utilityRates.gas}/therm
              </span>
            </div>
            <button
              className={styles.secondaryButton}
              onClick={() => navigate("/admin/settings")}
              aria-label="Navigate to utility rates management page"
            >
              Manage Rates
            </button>
          </div>
        </div>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit}>
            {/* Desktop Table View */}
            <div className={styles.desktopView}>
              <div className={styles.tableContainer}>
                <table
                  className={styles.table}
                  role="table"
                  aria-label="Utility readings entry table"
                >
                  <thead>
                    <tr>
                      <th scope="col">Unit #</th>
                      <th scope="col">Tenant</th>
                      <th scope="col">Water Usage (gallons)</th>
                      <th scope="col">Electric Usage (kWh)</th>
                      <th scope="col">Gas Usage (therms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {occupiedUnits.length > 0 ? (
                      occupiedUnits.map((unit) => (
                        <tr key={unit.id}>
                          <td>{unit.unit_number}</td>
                          <td>{`${unit.tenant_info.first_name} ${unit.tenant_info.last_name}`}</td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className={styles.usageInput}
                              value={utilityData[unit.id]?.water_usage || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  unit.id,
                                  "water_usage",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 1500"
                              aria-label={`Water usage for unit ${unit.unit_number}`}
                              disabled={isSubmitting}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className={styles.usageInput}
                              value={utilityData[unit.id]?.electric_usage || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  unit.id,
                                  "electric_usage",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 650"
                              aria-label={`Electric usage for unit ${unit.unit_number}`}
                              disabled={isSubmitting}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className={styles.usageInput}
                              value={utilityData[unit.id]?.gas_usage || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  unit.id,
                                  "gas_usage",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 25"
                              aria-label={`Gas usage for unit ${unit.unit_number}`}
                              disabled={isSubmitting}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className={styles.emptyState}>
                          No occupied units found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className={styles.mobileView}>
              {occupiedUnits.length > 0 ? (
                <ul className={styles.unitCards} role="list">
                  {occupiedUnits.map((unit) => (
                    <li key={unit.id} className={styles.unitCard}>
                      <div className={styles.cardHeader}>
                        <h3>Unit {unit.unit_number}</h3>
                        <span className={styles.tenantName}>
                          {unit.tenant_info.first_name}{" "}
                          {unit.tenant_info.last_name}
                        </span>
                      </div>

                      <div className={styles.cardContent}>
                        <div className={styles.inputGroup}>
                          <label htmlFor={`water-${unit.id}`}>
                            Water Usage (gallons)
                          </label>
                          <input
                            id={`water-${unit.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            className={styles.mobileInput}
                            value={utilityData[unit.id]?.water_usage || ""}
                            onChange={(e) =>
                              handleInputChange(
                                unit.id,
                                "water_usage",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 1500"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label htmlFor={`electric-${unit.id}`}>
                            Electric Usage (kWh)
                          </label>
                          <input
                            id={`electric-${unit.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            className={styles.mobileInput}
                            value={utilityData[unit.id]?.electric_usage || ""}
                            onChange={(e) =>
                              handleInputChange(
                                unit.id,
                                "electric_usage",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 650"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label htmlFor={`gas-${unit.id}`}>
                            Gas Usage (therms)
                          </label>
                          <input
                            id={`gas-${unit.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            className={styles.mobileInput}
                            value={utilityData[unit.id]?.gas_usage || ""}
                            onChange={(e) =>
                              handleInputChange(
                                unit.id,
                                "gas_usage",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 25"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.noUnits}>
                  <p>No occupied units found.</p>
                </div>
              )}
            </div>

            <div className={styles.submitContainer}>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting || occupiedUnits.length === 0}
                aria-label="Submit utility readings and create bills"
              >
                {isSubmitting ? "Creating Bills..." : "Review & Post Bills"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
