import { useState, useEffect } from "react";
import { useUsers } from "../../Context/UsersContext";
import styles from "./ManageUsers.module.css";
import { useNotifications } from "../../Context/NotificationContext";

export default function EditUserModal({
  user,
  unit,
  units,
  properties,
  property,
  onClose,
  onSuccess,
}) {
  const { loading, putUser } = useUsers();
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(property?.id || 1);
  const [selectedUnit, setSelectedUnit] = useState(unit?.unit_number);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const check = window.confirm("Are you sure you want to update this user?");
    if (!check) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(event.target);

      const unitObj = Object.values(units).find(
        (unit) => unit.unit_number === Number(formData.get("unit"))
      );

      const newUserObj = {
        id: user.id,
        firstName: formData.get("first"),
        lastName: formData.get("last"),
        email: formData.get("email"),
        username: formData.get("username"),
        isManager: formData.get("is-manager") === "true",
        isCurrentUser: formData.get("is-active") === "true",
        unit: unitObj?.id,
      };

      await putUser(newUserObj);
      onSuccess();
    } catch (err) {
      setError("Failed to update user. Please try again.");
      console.error("Update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (unit?.unit_number) {
      setSelectedUnit(unit.unit_number);
    }
  }, [unit]);

  if (loading) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close edit user modal"
        >
          &times;
        </button>
        <h2>Edit User</h2>
        <p className={styles.modalDescription}>
          Update the user information below
        </p>
        <form onSubmit={handleSubmit} className={styles.editForm} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="edit-first" className={styles.formLabel}>
              First Name *
            </label>
            <input
              id="edit-first"
              className={styles.formInput}
              name="first"
              type="text"
              defaultValue={user.first_name}
              placeholder="First name"
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "edit-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-last" className={styles.formLabel}>
              Last Name *
            </label>
            <input
              id="edit-last"
              className={styles.formInput}
              name="last"
              type="text"
              defaultValue={user.last_name}
              placeholder="Last name"
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "edit-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-property" className={styles.formLabel}>
              Property *
            </label>
            <select
              id="edit-property"
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
            <label htmlFor="edit-unit" className={styles.formLabel}>
              Unit *
            </label>
            <select
              id="edit-unit"
              name="unit"
              className={styles.formSelect}
              value={selectedUnit}
              onChange={(event) => setSelectedUnit(Number(event.target.value))}
              required
              disabled={isSubmitting}
            >
              <option value={selectedUnit}>{selectedUnit}</option>
              {filteredUnits.map((unit) => (
                <option key={unit.id} value={unit.unit_number}>
                  {unit.unit_number}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-username" className={styles.formLabel}>
              Username *
            </label>
            <input
              id="edit-username"
              className={styles.formInput}
              name="username"
              type="text"
              defaultValue={user.username}
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "edit-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-email" className={styles.formLabel}>
              Email *
            </label>
            <input
              id="edit-email"
              className={styles.formInput}
              name="email"
              type="email"
              defaultValue={user.email}
              spellCheck="false"
              required
              disabled={isSubmitting}
              aria-describedby={error ? "edit-error" : undefined}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-manager" className={styles.formLabel}>
              Manager
            </label>
            <select
              id="edit-manager"
              className={styles.formSelect}
              name="is-manager"
              disabled={isSubmitting}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="edit-active" className={styles.formLabel}>
              Active User
            </label>
            <select
              id="edit-active"
              className={styles.formSelect}
              name="is-active"
              disabled={isSubmitting}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {error && (
            <div id="edit-error" className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Cancel editing and close modal"
            >
              Cancel
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
              aria-label={`Update user ${user.first_name} ${user.last_name}`}
            >
              {isSubmitting ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
