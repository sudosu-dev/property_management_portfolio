import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function EditResidentForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");
  const [currentUser, setCurrentUser] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Fetch existing property info on mount
  useEffect(() => {
    async function fetchResident() {
      try {
        const response = await axios.get(`${API}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const { first_name, last_name, email, unit, is_current_user } =
          response.data;

        setFirstName(first_name || "");
        setLastName(last_name || "");
        setEmail(email || "");
        setUnit(unit !== null && unit !== undefined ? unit.toString() : "");
        setCurrentUser(Boolean(is_current_user));
      } catch (error) {
        console.error("Error fetching resident:", error);
      }
    }

    fetchResident();
  }, [id, token]);

  // Handle PATCH request to update property
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API}/users/${id}`,
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          unit: unit,
          isCurrentUser: currentUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resident updated:", response.data);
      navigate(`/admin/viewresident/${id}`);
    } catch (error) {
      console.error("Error updating resident:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Edit Resident</h2>
        <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <br />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <br />

          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />

          <label>Unit</label>
          <input
            type="number"
            value={unit ?? ""}
            onChange={(e) => setUnit(e.target.value)}
          />
          <br />

          <label>Current User</label>
          <input
            type="checkbox"
            checked={currentUser}
            onChange={(e) => setCurrentUser(e.target.checked)}
          />

          <input type="submit" value="Save Changes" />
        </form>
      </div>

      <button onClick={() => navigate(`/admin/viewresident/${id}`)}>
        Back
      </button>
    </>
  );
}
