import styles from "./ManageUnits.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../Context/NotificationContext";

export default function ManageUnits() {
  const { showError, showSuccess } = useNotifications();
  const { token, user } = useAuth();
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const toAddUnitForm = () => {
    navigate("/admin/addunit");
  };

  if (!user?.is_manager) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Access Denied</h1>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);
        const response = await fetch(`${API}/units`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch units");
        }

        const data = await response.json();
        setUnits(data);
      } catch (err) {
        setError(err.message);
        showError("Failed to load units: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, [token, showError]);

  const handleDelete = async (unitId, unitNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Unit ${unitNumber}? This action cannot be undone.`
      )
    )
      return;

    try {
      const response = await fetch(`${API}/units/${unitId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete unit");
      }

      setUnits((prev) => prev.filter((p) => p.id !== unitId));
      showSuccess(`Unit ${unitNumber} deleted successfully`);
    } catch (err) {
      showError("Error deleting unit: " + err.message);
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading units"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading units...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Error Loading Units</h1>
          <p>{error}</p>
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
      <header className={styles.topBar}>
        <h1>Units</h1>
        <button
          className={styles.primaryButton}
          onClick={toAddUnitForm}
          aria-label="Navigate to add new unit form"
        >
          + Add new unit
        </button>
      </header>

      <main className={styles.content}>
        {units.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className={styles.desktopView}>
              <div className={styles.tableContainer}>
                <table
                  className={styles.table}
                  role="table"
                  aria-label="Units management table"
                >
                  <thead>
                    <tr>
                      <th scope="col">Property ID</th>
                      <th scope="col">Unit Number</th>
                      <th scope="col">Rent Amount</th>
                      <th scope="col">Notes</th>
                      <th scope="col">Tenants</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((unit) => (
                      <tr key={unit.id}>
                        <td>{unit.property_id}</td>
                        <td>{unit.unit_number}</td>
                        <td>
                          {unit.rent_amount
                            ? `$${parseFloat(
                                unit.rent_amount
                              ).toLocaleString()}`
                            : "Not set"}
                        </td>
                        <td>{unit.notes || "None"}</td>
                        <td>{unit.tenants || "None"}</td>
                        <td className={styles.actionsCell}>
                          <button
                            onClick={() =>
                              navigate(`/admin/editunit/${unit.id}`)
                            }
                            className={styles.editButton}
                            aria-label={`Edit unit ${unit.unit_number}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(unit.id, unit.unit_number)
                            }
                            className={styles.deleteButton}
                            aria-label={`Delete unit ${unit.unit_number}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className={styles.mobileView}>
              <ul className={styles.unitCards} role="list">
                {units.map((unit) => (
                  <li key={unit.id} className={styles.unitCard}>
                    <div className={styles.cardHeader}>
                      <h2>Unit {unit.unit_number}</h2>
                      <span className={styles.propertyId}>
                        Property ID: {unit.property_id}
                      </span>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.cardField}>
                        <span className={styles.fieldLabel}>Rent Amount:</span>
                        <span className={styles.fieldValue}>
                          {unit.rent_amount
                            ? `$${parseFloat(
                                unit.rent_amount
                              ).toLocaleString()}`
                            : "Not set"}
                        </span>
                      </div>

                      <div className={styles.cardField}>
                        <span className={styles.fieldLabel}>Notes:</span>
                        <span className={styles.fieldValue}>
                          {unit.notes || "None"}
                        </span>
                      </div>

                      <div className={styles.cardField}>
                        <span className={styles.fieldLabel}>Tenants:</span>
                        <span className={styles.fieldValue}>
                          {unit.tenants || "None"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        onClick={() => navigate(`/admin/editunit/${unit.id}`)}
                        className={styles.editButton}
                        aria-label={`Edit unit ${unit.unit_number}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(unit.id, unit.unit_number)}
                        className={styles.deleteButton}
                        aria-label={`Delete unit ${unit.unit_number}`}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <h2>No Units Found</h2>
            <p>Get started by adding your first unit.</p>
            <button
              className={styles.primaryButton}
              onClick={toAddUnitForm}
              aria-label="Add your first unit"
            >
              Add Unit
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
