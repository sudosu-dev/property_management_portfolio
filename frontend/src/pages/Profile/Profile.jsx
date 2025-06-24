import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import "./profile.css";
// import styles from "./test.module.css";

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
      <div
        style={{
          border: "5px solid orange",
          width: "90vw",
          margin: "0 auto",
        }}
      >
        <h2>Account Profile</h2>
        {/* NEW VERSION */}
        <br />
        <br />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            // alignItems: "center",
            maxWidth: "800px",
            border: "1px solid green",
            padding: "2em",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "1em",
              // border: "1px solid #ccc",
            }}
          >
            <span
              style={{
                display: "block",
              }}
            >
              First Name
            </span>
            <div
              style={{
                display: "inline-block",
                padding: "1em",
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {user.first_name || "(not set)"}
            </div>
          </div>
          <br />
          <br />
          <div
            style={{
              display: "inline-block",
              padding: "1em",
              // border: "1px solid #ccc",
            }}
          >
            <span
              style={{
                display: "block",
              }}
            >
              Last Name
            </span>
            <div
              style={{
                display: "inline-block",
                padding: "1em",
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {user.last_name || "(not set)"}
            </div>
          </div>
          <br />
          <br />
          <div
            style={{
              display: "inline-block",
              padding: "1em",
              // border: "1px solid #ccc",
            }}
          >
            <span
              style={{
                display: "block",
              }}
            >
              Email
            </span>
            <div
              style={{
                display: "inline-block",
                padding: "1em",
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {user.email || "(not set)"}
            </div>
          </div>
          <br />
          <br />
          <div
            style={{
              display: "inline-block",
              padding: "1em",
              // border: "1px solid #ccc",
            }}
          >
            <span
              style={{
                display: "block",
              }}
            >
              Username
            </span>
            <div
              style={{
                display: "inline-block",
                padding: "1em",
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {user.username || "(not set)"}
            </div>
          </div>
          <br />
          <br />
          <div
            style={{
              display: "inline-block",
              padding: "1em",
              // border: "1px solid #ccc",
            }}
          >
            <span
              style={{
                display: "block",
              }}
            >
              Unit
            </span>
            <div
              style={{
                display: "inline-block",
                padding: "1em",
                width: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {user.unit || "(not set)"}
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn btn-primary btn-small"
            onClick={() => setCurrentView("edit")}
            style={{
              float: "right",
            }}
          >
            Edit Profile 2
          </button>
        </div>
        <br /><br />
        {/* END */}

        <div>
          <button
            className="btn btn-primary btn-small"
            onClick={() => setCurrentView("edit")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    );
  }
  function editProfile() {
    return (
      <div>
        <div
          style={{ width: "1041px", height: "660px", border: "1px solid #ccc" }}
        >
          <h2>Edit Profile</h2>
          <form>
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
              <button
                className="btn btn-primary btn-small"
                onClick={stageProfileChanges}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  function confirmProfile() {
    return (
      <div
        style={{ width: "1041px", height: "660px", border: "1px solid #ccc" }}
      >
        {/* <h2>Account Profile</h2> */}
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
    <div>
      <h1>Account Profile</h1>
      {currentView === "view" && viewProfile()}
      {currentView === "edit" && editProfile()}
      {currentView === "confirm" && confirmProfile()}
    </div>
  );
}
