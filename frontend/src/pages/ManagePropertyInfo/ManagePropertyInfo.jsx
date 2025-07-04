import styles from "./ManagePropertyInfo.module.css";
import propertyPlaceholder from "../../assets/property-placeholder.jpg";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../Context/NotificationContext";

export default function ManagePropertyInfo() {
  const { showError, showSuccess } = useNotifications();
  const { token, user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const toAddPropertyForm = () => {
    navigate("/admin/addproperty");
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
    async function fetchProperties() {
      try {
        setLoading(true);
        const response = await fetch(`${API}/properties`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
        showError("Failed to load properties: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [token, showError]);

  const handleDelete = async (propertyId, propertyName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${propertyName}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const response = await fetch(`${API}/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete property");
      }

      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      showSuccess(`Property "${propertyName}" deleted successfully`);
    } catch (err) {
      showError("Error deleting property: " + err.message);
      console.error("Delete error:", err);
    }
  };

  function formatPhoneNumber(phoneNumberString) {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");

    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumberString;
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading properties"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Error Loading Properties</h1>
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
        <h1>Properties</h1>
        <button
          className={styles.primaryButton}
          onClick={toAddPropertyForm}
          aria-label="Navigate to add new property form"
        >
          + Add new property
        </button>
      </header>

      <main>
        {properties.length > 0 ? (
          <ul className={styles.propertyCards} role="list">
            {properties.map((property) => (
              <li key={property.id} className={styles.propertyCard}>
                <div className={styles.propertyCardInfo}>
                  <div className={styles.propertyCardImage}>
                    <img
                      src={propertyPlaceholder}
                      alt={`Property image for ${property.property_name}`}
                    />
                  </div>
                  <div className={styles.propertyCardText}>
                    <h2>{property.property_name}</h2>
                    <address>{property.address}</address>
                    <p>
                      <span className={styles.label}>Contact:</span>
                      {property.phone_number ? (
                        <a
                          href={`tel:${property.phone_number}`}
                          className={styles.phoneLink}
                          aria-label={`Call ${formatPhoneNumber(
                            property.phone_number
                          )}`}
                        >
                          {formatPhoneNumber(property.phone_number)}
                        </a>
                      ) : (
                        <span>Not provided</span>
                      )}
                    </p>
                    <p>
                      <span className={styles.label}>Total Units:</span>
                      {property.total_units || "Not specified"}
                    </p>
                    <div className={styles.propertyCardButtons}>
                      <button
                        onClick={() =>
                          navigate(`/admin/editproperty/${property.id}`)
                        }
                        className={styles.editButton}
                        aria-label={`Edit ${property.property_name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(property.id, property.property_name)
                        }
                        className={styles.deleteButton}
                        aria-label={`Delete ${property.property_name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <h2>No Properties Found</h2>
            <p>Get started by adding your first property.</p>
            <button
              className={styles.primaryButton}
              onClick={toAddPropertyForm}
              aria-label="Add your first property"
            >
              Add Property
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
