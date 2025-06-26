import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import "./profile.css";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, token, setUser } = useAuth();

  console.log("Profile component - user:", user);
  console.log("Profile component - token:", token);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    unit: "",
  });

  const [currentView, setCurrentView] = useState("view");
  const [pendingChanges, setPendingChanges] = useState({});

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

    try {
      const response = await fetch(`${API}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pendingChanges),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full server error:", errorText);
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Profile updated successfully.", result);
      console.log("Backend returned:", result); // remove this
      console.log("Current user before setUser:", user); // remove this

      setUser(result);
      console.log("User after setUser should update on next render"); //remove this
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setCurrentView("view");
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      username: user.username || "",
      unit: user.unit || "",
    });
    setPendingChanges({});
    setCurrentView("view");
  };

  function stageProfileChanges() {
    const changes = {};
    if (formData.firstName !== user.first_name) {
      changes.firstName = formData.firstName;
    }
    if (formData.lastName !== user.last_name) {
      changes.lastName = formData.lastName;
    }
    if (formData.email !== user.email) {
      changes.email = formData.email;
    }
    setPendingChanges(changes);
    setCurrentView("confirm");
  }

  function viewProfile() {
    console.log("viewProfile rendering with user:", user); // remove this
    return (
      <div className={styles.form}>
        <h2>Account Profile</h2>

        <div className={styles.content}>
          <div className={styles.field}>
            <span className={styles.label}>First Name</span>
            <div className={styles.info}>{user.first_name || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Last Name</span>
            <div className={styles.info}>{user.last_name || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Email</span>
            <div className={styles.info}>{user.email || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Username</span>
            <div className={styles.info}>{user.username || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Unit</span>
            <div className={styles.info}>{user.unit || "(not set)"}</div>
          </div>
        </div>

        <div>
          <button
            className="btn btn-primary btn-small"
            onClick={() => setCurrentView("edit")}
            style={{ marginLeft: "80%" }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    );
  }
  function editProfile() {
    return (
      <div className={styles.form}>
        <h2>Edit Profile</h2>
        <form>
          <div className={styles.content}>
            <div className={styles.field}>
              <label className={styles.label}>First Name</label>
              <input
                className={styles.info}
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Last Name</label>
              <input
                className={styles.info}
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.info}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.info}
                type="text"
                value={formData.username}
                readOnly
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Unit</label>
              <input
                className={styles.info}
                type="text"
                value={formData.unit}
                readOnly
              />
            </div>
          </div>
          <button
            className="btn btn-primary btn-small"
            onClick={stageProfileChanges}
            style={{ marginLeft: "80%" }}
          >
            Next
          </button>
        </form>
      </div>
    );
  }
  function confirmProfile() {
    return (
      <div className={styles.form}>
        <table>
          <tr>
            <td>First Name:</td>
            <td style={{ color: pendingChanges.firstName ? "red" : "black" }}>
              {pendingChanges.firstName || user.first_name}
            </td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td style={{ color: pendingChanges.lastName ? "red" : "black" }}>
              {pendingChanges.lastName || user.last_name}
            </td>
          </tr>
          <tr>
            <td>Email:</td>
            <td style={{ color: pendingChanges.email ? "red" : "black" }}>
              {pendingChanges.email || user.email}
            </td>
          </tr>
          <tr>
            <td>Username:</td>
            <td>{user.username || "(not set)"} </td>
          </tr>
          <tr>
            <td>Unit:</td>
            <td>{user.unit || "(not set)"}</td>
          </tr>
        </table>
        <div>
          <button className="btn btn-primary btn-small" onClick={handleSubmit}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary btn-small"
            onClick={handleCancel}
          >
            Cancel Changes
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <h1>Account Profile</h1>
      {currentView === "view" && viewProfile()}
      {currentView === "edit" && editProfile()}
      {currentView === "confirm" && confirmProfile()}
    </div>
  );
}
