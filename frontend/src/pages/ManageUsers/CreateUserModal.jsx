import { useState, useEffect } from "react";
import { useUsers } from "../../Context/UsersContext";
import styles from "./ManageUsers.module.css";
import { useNotifications } from "../../Context/NotificationContext";

export default function CreateUserModal({
  units,
  properties,
  onClose,
  onSuccess,
}) {
  const { loading, getUsers, registerUser } = useUsers();
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { showError } = useNotifications();

  useEffect(() => {
    if (!selectedProperty || !units) return;

    const unitsByProperty = Object.values(units).filter(
      (unit) => unit.property_id === selectedProperty
    );

    setFilteredUnits(unitsByProperty);
  }, [selectedProperty, units]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);

      const unitObj = Object.values(units).find(
        (unit) => unit.unit_number === Number(formData.get("unit"))
      );

      const username = formData.get("username");
      const password = formData.get("password");
      const confPassword = formData.get("confPassword");
      const firstName = formData.get("first");
      const lastName = formData.get("last");
      const email = formData.get("email");
      const unit = unitObj?.id;

      // Validation
      if (!firstName?.trim()) {
        setError("First name is required");
        setIsSubmitting(false);
        return;
      }

      if (!lastName?.trim()) {
        setError("Last name is required");
        setIsSubmitting(false);
        return;
      }

      if (!username?.trim()) {
        setError("Username is required");
        setIsSubmitting(false);
        return;
      }

      if (!email?.trim()) {
        setError("Email is required");
        setIsSubmitting(false);
        return;
      }

      if (password !== confPassword) {
        setError("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      if (password.length <= 6) {
        setError("Password must be at least 7 characters");
        setIsSubmitting(false);
        return;
      }

      const check = window.confirm(
        "Are you sure you want to create this user?"
      );
      if (!check) {
        setIsSubmitting(false);
        return;
      }

      await registerUser({
        username: username.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        unit,
      });

      onSuccess();
    } catch (e) {
      console.log("Something went wrong: " + e);
      setError("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close create user modal"
        >
          &times;
        </button>
        <h2>Create New User</h2>
        <p className={styles.modalDescription}>
          Enter the new user information below
        </p>
        <form onSubmit={handleCreate} className={styles.editForm} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="create-first" className={styles.formLabel}>
              First Name *
            </label>
            <input
              id="create-first"
              className={styles.formInput}
              name="first"
              type="text"
              placeholder="First name"
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "create-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="create-last" className={styles.formLabel}>
              Last Name *
            </label>
            <input
              id="create-last"
              className={styles.formInput}
              name="last"
              type="text"
              placeholder="Last name"
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "create-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="create-property" className={styles.formLabel}>
              Property *
            </label>
            <select
              id="create-property"
              name="property"
              className={styles.formSelect}
              value={selectedProperty}
              onChange={(event) => {
                const newPropId = Number(event.target.value);
                setSelectedProperty(newPropId);
                setSelectedUnit("");
              }}
              required
              disabled={isSubmitting}
            >
              {Object.values(properties).map((property) => (
                <option key={property.id} value={property.id}>
                  {property.property_name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="create-unit" className={styles.formLabel}>
              Unit *
            </label>
            <select
              id="create-unit"
              name="unit"
              className={styles.formSelect}
              value={selectedUnit}
              onChange={(event) => setSelectedUnit(Number(event.target.value))}
              required
              disabled={isSubmitting}
            >
              <option value="">Select a unit</option>
              {filteredUnits.map((unit) => (
                <option key={unit.id} value={unit.unit_number}>
                  {unit.unit_number}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="create-username" className={styles.formLabel}>
              Username *
            </label>
            <input
              id="create-username"
              className={styles.formInput}
              name="username"
              type="text"
              placeholder="Username"
              autoComplete="off"
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "create-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="create-email" className={styles.formLabel}>
              Email *
            </label>
            <input
              id="create-email"
              className={styles.formInput}
              name="email"
              type="email"
              placeholder="Email address"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "create-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="create-password" className={styles.formLabel}>
              Password *
            </label>
            <input
              id="create-password"
              className={styles.formInput}
              name="password"
              type="password"
              placeholder="Password (minimum 7 characters)"
              autoComplete="new-password"
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "create-error" : "password-help"}
            />
            <span id="password-help" className={styles.helpText}>
              Password must be at least 7 characters long
            </span>
          </div>

          <div className={styles.formGroup}>
            <label
              htmlFor="create-confirm-password"
              className={styles.formLabel}
            >
              Confirm Password *
            </label>
            <input
              id="create-confirm-password"
              className={styles.formInput}
              name="confPassword"
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "create-error" : undefined}
            />
          </div>

          {error && (
            <div id="create-error" className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Cancel creating user and close modal"
            >
              Cancel
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
              aria-label="Create new user account"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
