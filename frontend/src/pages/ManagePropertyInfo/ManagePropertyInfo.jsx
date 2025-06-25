import styles from "./ManagePropertyInfo.module.css";
import propertyPlaceholder from "../../assets/property-placeholder.jpg";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import { useNavigate } from "react-router-dom";

export default function ManagePropertyInfo() {
  const { token, user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const toAddPropertyForm = () => {
    navigate("/admin/addproperty");
  };

  if (!user?.is_manager) {
    return <p>Access Denied</p>;
  }

  useEffect(() => {
    async function fetchProperties() {
      try {
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
      }
    }

    fetchProperties();
  }, [token]);

  if (error) return <p>Error: {error}</p>;

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
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
    } catch (err) {
      alert("Error deleting property: " + err.message);
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

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1>Properties</h1>
        <div className={styles.addProperty}>
          <button onClick={toAddPropertyForm}>+ Add new property</button>
        </div>
      </div>
      <ul className={styles.propertyCards}>
        {properties.map((property) => (
          <li key={property.id} className={styles.propertyCard}>
            <div className={styles.propertyCardInfo}>
              <div className={styles.propertyCardImage}>
                <img
                  src={propertyPlaceholder}
                  alt="Property placeholder image"
                />
              </div>
              <div className={styles.propertyCardText}>
                <h2>{property.property_name}</h2>
                <address>{property.address}</address>
                <p>Contact: {formatPhoneNumber(property.phone_number)}</p>
                <p>Total Units: {property.total_units}</p>
                <div className={styles.propertyCardButtons}>
                  <button
                    onClick={() =>
                      navigate(`/admin/editproperty/${property.id}`)
                    }
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
