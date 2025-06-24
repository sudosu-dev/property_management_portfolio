import styles from "./ManageResidents.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewResident() {
  const { token, user } = useAuth();
  const { id } = useParams();
  const [resident, setResident] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  if (!user?.is_manager) {
    return <p>Access Denied</p>;
  }

  useEffect(() => {
    async function fetchResident() {
      try {
        const response = await fetch(`${API}/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch resident");
        }

        const data = await response.json();
        setResident(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchResident();
  }, [id, token]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Unit</th>
            <th>Current User?</th>
            <th>Account Created</th>
          </tr>
        </thead>
        <tbody>
          <tr key={resident.id} className={styles.residentCard}>
            <td>{resident.first_name}</td>
            <td>{resident.last_name}</td>
            <td>{resident.email}</td>
            <td>{resident.unit}</td>
            <td>{resident.is_current_user ? "Yes" : "No"}</td>
            <td>{resident.created_at}</td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={() => navigate(`/admin/editresident/${resident.id}`)}
        className={styles.editButton}
      >
        Edit
      </button>
      <button onClick={() => navigate("/admin/residents")}>Back</button>
    </div>
  );
}
