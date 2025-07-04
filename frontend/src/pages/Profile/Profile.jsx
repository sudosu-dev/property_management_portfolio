import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { API } from "../../api/ApiContext";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, token, setUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    unit: "",
  });

  const [currentView, setCurrentView] = useState("view");
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Clear messages when view changes
  useEffect(() => {
    setError("");
    setSuccessMessage("");
  }, [currentView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

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
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      setUser(result);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setCurrentView("view");
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    setError("");
    setCurrentView("view");
  };

  const stageProfileChanges = () => {
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

    if (Object.keys(changes).length === 0) {
      setError("No changes detected.");
      return;
    }

    setPendingChanges(changes);
    setError("");
    setCurrentView("confirm");
  };

  const viewProfile = () => {
    return (
      <div className={styles.formContainer}>
        <h2>Account Profile</h2>

        <div className={styles.content}>
          <div className={styles.field}>
            <span className={styles.label}>First Name</span>
            <div className={styles.value}>{user.first_name || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Last Name</span>
            <div className={styles.value}>{user.last_name || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Email</span>
            <div className={styles.value}>{user.email || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Username</span>
            <div className={styles.value}>{user.username || "(not set)"}</div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Unit</span>
            <div className={styles.value}>{user.unit || "(not set)"}</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => setCurrentView("edit")}
            aria-label="Edit your profile information"
          >
            Edit Profile
          </button>
        </div>
      </div>
    );
  };

  const editProfile = () => {
    return (
      <div className={styles.formContainer}>
        <h2>Edit Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            stageProfileChanges();
          }}
          noValidate
        >
          <div className={styles.content}>
            <div className={styles.field}>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <input
                id="firstName"
                className={styles.input}
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                aria-describedby={error ? "profile-error" : undefined}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <input
                id="lastName"
                className={styles.input}
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                aria-describedby={error ? "profile-error" : undefined}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                aria-describedby={error ? "profile-error" : undefined}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                id="username"
                className={styles.input}
                type="text"
                value={formData.username}
                readOnly
                disabled
                aria-describedby="username-help"
              />
              <span id="username-help" className={styles.helpText}>
                Username cannot be changed
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="unit" className={styles.label}>
                Unit
              </label>
              <input
                id="unit"
                className={styles.input}
                type="text"
                value={formData.unit}
                readOnly
                disabled
                aria-describedby="unit-help"
              />
              <span id="unit-help" className={styles.helpText}>
                Contact management to change unit
              </span>
            </div>
          </div>

          {error && (
            <div
              id="profile-error"
              className={styles.errorMessage}
              role="alert"
            >
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primaryButton}
              aria-label="Continue to review your changes"
            >
              Next
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleCancel}
              aria-label="Cancel editing and return to profile view"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const confirmProfile = () => {
    return (
      <div className={styles.formContainer}>
        <h2>Confirm Changes</h2>
        <p className={styles.confirmDescription}>
          Please review your changes below. Changed fields are highlighted in
          red.
        </p>

        {/* Desktop Table View */}
        <div className={styles.desktopView}>
          <table
            className={styles.confirmTable}
            role="table"
            aria-label="Profile changes summary"
          >
            <tbody>
              <tr>
                <td className={styles.confirmLabel}>First Name:</td>
                <td
                  className={
                    pendingChanges.firstName ? styles.pendingChange : ""
                  }
                >
                  {pendingChanges.firstName || user.first_name || "(not set)"}
                </td>
              </tr>
              <tr>
                <td className={styles.confirmLabel}>Last Name:</td>
                <td
                  className={
                    pendingChanges.lastName ? styles.pendingChange : ""
                  }
                >
                  {pendingChanges.lastName || user.last_name || "(not set)"}
                </td>
              </tr>
              <tr>
                <td className={styles.confirmLabel}>Email:</td>
                <td
                  className={pendingChanges.email ? styles.pendingChange : ""}
                >
                  {pendingChanges.email || user.email || "(not set)"}
                </td>
              </tr>
              <tr>
                <td className={styles.confirmLabel}>Username:</td>
                <td>{user.username || "(not set)"}</td>
              </tr>
              <tr>
                <td className={styles.confirmLabel}>Unit:</td>
                <td>{user.unit || "(not set)"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className={styles.mobileView}>
          <div className={styles.confirmCards}>
            <div className={styles.confirmCard}>
              <div className={styles.confirmCardLabel}>First Name</div>
              <div
                className={
                  pendingChanges.firstName
                    ? styles.pendingChange
                    : styles.confirmCardValue
                }
              >
                {pendingChanges.firstName || user.first_name || "(not set)"}
              </div>
            </div>

            <div className={styles.confirmCard}>
              <div className={styles.confirmCardLabel}>Last Name</div>
              <div
                className={
                  pendingChanges.lastName
                    ? styles.pendingChange
                    : styles.confirmCardValue
                }
              >
                {pendingChanges.lastName || user.last_name || "(not set)"}
              </div>
            </div>

            <div className={styles.confirmCard}>
              <div className={styles.confirmCardLabel}>Email</div>
              <div
                className={
                  pendingChanges.email
                    ? styles.pendingChange
                    : styles.confirmCardValue
                }
              >
                {pendingChanges.email || user.email || "(not set)"}
              </div>
            </div>

            <div className={styles.confirmCard}>
              <div className={styles.confirmCardLabel}>Username</div>
              <div className={styles.confirmCardValue}>
                {user.username || "(not set)"}
              </div>
            </div>

            <div className={styles.confirmCard}>
              <div className={styles.confirmCardLabel}>Unit</div>
              <div className={styles.confirmCardValue}>
                {user.unit || "(not set)"}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div
            className={styles.successMessage}
            role="alert"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
            aria-label="Save your profile changes"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            className={styles.secondaryButton}
            onClick={handleCancel}
            disabled={isSubmitting}
            aria-label="Cancel changes and return to profile view"
          >
            Cancel Changes
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Account Profile</h1>
        <p className={styles.description}>
          Manage your account information and contact details
        </p>
      </header>

      <main>
        {currentView === "view" && viewProfile()}
        {currentView === "edit" && editProfile()}
        {currentView === "confirm" && confirmProfile()}
      </main>
    </div>
  );
}
