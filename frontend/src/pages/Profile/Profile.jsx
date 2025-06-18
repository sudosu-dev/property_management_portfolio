import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";

export default function Profile() {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    unit: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
        unit: user.unit || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    try {
      const response = await fetch(`${API}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full server error:", errorText);
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      console.log("Profile updated successfully.", result);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <h1>Account Profile</h1>
      <div
        style={{ width: "1041px", height: "660px", border: "1px solid #ccc" }}
      >
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <label>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label>Username</label>
            <input type="text" value={formData.username} readOnly />
          </div>
          <div>
            <label>Unit</label>
            <input type="text" value={formData.unit} readOnly />
          </div>
          <div>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
