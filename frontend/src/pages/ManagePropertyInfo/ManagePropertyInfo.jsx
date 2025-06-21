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

  return (
    <div>
      <div className={styles.topBar}>
        <h1>Properties</h1>
        <div className={styles.crudButtons}>
          <button onClick={toAddPropertyForm}>Add new property</button>
          <button>Edit properties</button>
          <button>Delete property</button>
        </div>
      </div>
      <ul className={styles.propertyCards}>
        {properties.map((property) => (
          <li key={property.id} className={styles.propertyCard}>
            <div>
              <img src={propertyPlaceholder} alt="Property placeholder image" />
            </div>
            <div>
              <h2>{property.property_name}</h2>
              <address>{property.address}</address>
              <p>Unit Count: {property.total_units}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
