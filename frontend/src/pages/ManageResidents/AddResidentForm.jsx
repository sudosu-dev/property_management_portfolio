import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";

export default function AddResidentForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);

  // Fetch available units for dropdown
  useEffect(() => {
    async function fetchUnits() {
      try {
        const response = await fetch(`${API}/units`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUnits(data);
      } catch (err) {
        console.error("Error fetching units:", err);
      }
    }

    fetchUnits();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email,
          unit,
          isManager: false,
          isCurrentUser,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add resident");
      }

      navigate("/admin/residents");
    } catch (err) {
      setError(err.message);
      console.error("Error adding resident:", err);
    }
  };

  return (
    <div>
      <h2>Add New Resident</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Unit</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
          <option value="">Select a Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.unit_number} - {u.property_name}
            </option>
          ))}
        </select>

        <label>
          Current User
          <input
            type="checkbox"
            checked={isCurrentUser}
            onChange={(e) => setIsCurrentUser(e.target.checked)}
          />
        </label>

        {error && <p>{error}</p>}

        <button type="submit">Add Resident</button>
      </form>

      <button onClick={() => navigate("/admin/residents")}>Cancel</button>
    </div>
  );
}
