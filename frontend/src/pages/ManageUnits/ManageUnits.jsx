import styles from "./ManageUnits.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import { useNavigate } from "react-router-dom";

export default function ManageUnits() {
  const { token, user } = useAuth();
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const toAddUnitForm = () => {
    navigate("/admin/addunit");
  };

  if (!user?.is_manager) {
    return <p>Access Denied</p>;
  }

  useEffect(() => {
    async function fetchUnits() {
      try {
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
      }
    }

    fetchUnits();
  }, [token]);

  if (error) return <p>Error: {error}</p>;

  const handleDelete = async (unitId) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

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
    } catch (err) {
      alert("Error deleting unit: " + err.message);
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1>Units</h1>
        <button className={styles.primaryButton} onClick={toAddUnitForm}>
          + Add new unit
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Property ID</th>
                <th>Unit Number</th>
                <th>Rent Amount</th>
                <th>Notes</th>
                <th>Tenants</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td>{unit.property_id}</td>
                  <td>{unit.unit_number}</td>
                  <td>{unit.rent_amount}</td>
                  <td>{unit.notes}</td>
                  <td>{unit.tenants}</td>
                  <td className={styles.button}>
                    <button
                      onClick={() => navigate(`/admin/editunit/${unit.id}`)}
                      className={styles.editDeleteButton}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(unit.id)}
                      className={styles.editDeleteButton}
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
    </div>
  );
}
