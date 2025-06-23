import styles from "./ManageResidents.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function ManageResidents() {
  const { token, user } = useAuth();
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const toAddResidentForm = () => {
    navigate("/admin/addresident");
  };

  if (!user?.is_manager) {
    return <p>Access Denied</p>;
  }

  useEffect(() => {
    async function fetchResidents() {
      try {
        const response = await fetch(`${API}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch residents");
        }

        const data = await response.json();

        data.sort((a, b) => {
          const unitA = parseInt(a.unit) || 0;
          const unitB = parseInt(b.unit) || 0;
          return unitA - unitB;
        });

        setResidents(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchResidents();
  }, [token]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className={styles.topBar}>
        <h1>Residents</h1>
        <div className={styles.crudButtons}>
          <button onClick={toAddResidentForm}>Add new resident</button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {residents
            .filter((resident) => !resident.is_manager)
            .map((resident) => (
              <tr
                key={resident.id}
                className={styles.residentCard}
                onClick={() => navigate(`/admin/viewresident/${resident.id}`)}
              >
                <td>{resident.first_name}</td>
                <td>{resident.last_name}</td>
                <td>{resident.email}</td>
                <td>{resident.unit}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
