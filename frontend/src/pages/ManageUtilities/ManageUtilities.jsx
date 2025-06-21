// frontend/src/pages/ManagerUtilities/ManagerUtilities.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";
import { useApi } from "../../api/ApiContext";
import styles from "./ManageUtilities.module.css";

export default function ManagerUtilities() {
  const navigate = useNavigate();
  const { request } = useApi();
  const { data: units, loading: loadingUnits } = useQuery("/units", "units");
  const { data: settings } = useQuery("/settings", "settings");

  const [utilityData, setUtilityData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utilityRates = {
    water: settings?.rate_water || 0,
    electric: settings?.rate_electric || 0,
    gas: settings?.rate_gas || 0,
  };

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
      alert("Please enter usage data for at least one unit.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await request("/utilities", {
        method: "POST",
        body: JSON.stringify(billsToCreate),
      });
      alert(result.message);
    } catch (error) {
      alert(`Failed to create utility bills: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Enter Monthly Utility Readings</h1>
      </header>

      <section className={styles.section}>
        <div className={styles.ratesDisplay}>
          <p>
            Current Rates:
            <span> Water: ${utilityRates.water}/gal</span> |
            <span> Electric: ${utilityRates.electric}/kWh</span> |
            <span> Gas: ${utilityRates.gas}/therm</span>
          </p>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/admin/settings")}
          >
            Manage Rates
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Unit #</th>
                  <th>Tenant</th>
                  <th>Water Usage (gallons)</th>
                  <th>Electric Usage (kWh)</th>
                  <th>Gas Usage (therms)</th>
                </tr>
              </thead>
              <tbody>
                {loadingUnits ? (
                  <tr>
                    <td colSpan="5">Loading units...</td>
                  </tr>
                ) : (
                  units
                    ?.filter((unit) => unit.tenant_info?.id)
                    .map((unit) => (
                      <tr key={unit.id}>
                        <td>{unit.unit_number}</td>
                        <td>{`${unit.tenant_info.first_name} ${unit.tenant_info.last_name}`}</td>
                        <td>
                          <input
                            type="number"
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
                          />
                        </td>
                        <td>
                          <input
                            type="number"
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
                          />
                        </td>
                        <td>
                          <input
                            type="number"
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
                          />
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.submitContainer}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Review & Post Bills"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
