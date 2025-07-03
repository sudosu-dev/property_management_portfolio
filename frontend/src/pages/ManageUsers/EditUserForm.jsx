import { useState, useEffect } from "react";
import { useUsers } from "../../Context/UsersContext";
import styles from "./ManageUsers.module.css";
import { useNotifications } from "../../Context/NotificationContext";

export default function EditUserForm({
  user,
  unit,
  units,
  properties,
  property,
  onCancel,
  isNewUser,
}) {
  const { loading, putUser, getUsers, registerUser } = useUsers();
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(property?.id || 1);
  const [selectedUnit, setSelectedUnit] = useState(unit?.unit_number);
  const { showError } = useNotifications();

  useEffect(() => {
    if (!selectedProperty || !units) return;

    const unitsByProperty = Object.values(units).filter(
      (unit) => unit.property_id === selectedProperty
    );

    setFilteredUnits(unitsByProperty);
  }, [selectedProperty, units, isNewUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const check = window.confirm("Are you sure you want to update this user?");
    if (!check) return;
    onCancel();
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
    await getUsers();
  };

  const handleCreate = async (event) => {
    event.preventDefault();

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

    if (password !== confPassword) return showError("Passwords do not match");
    if (password.length <= 6)
      return showError("Password must be at least 7 characters");

    const check = window.confirm("Are you sure you want to create this user?");
    if (!check) return;

    try {
      await registerUser({
        username,
        password,
        firstName,
        lastName,
        email,
        unit,
      });
    } catch (e) {
      const error = e;
      console.log("Somthing went wrong: " + error);
    }

    await getUsers();
  };

  useEffect(() => {
    if (unit?.unit_number) {
      setSelectedUnit(unit.unit_number);
    }
  }, [unit]);

  if (loading) return null;

  if (isNewUser)
    return (
      <div>
        <form onSubmit={handleCreate} className={styles.editForm}>
          <div className={styles.row}>
            <label>First: </label>
            <input
              className={styles.nameInput}
              name="first"
              type="text"
              placeholder="first name"
              spellCheck="false"
            />
          </div>
          <div className={styles.row}>
            <label>Last: </label>
            <input
              className={styles.nameInput}
              name="last"
              type="text"
              placeholder="last name"
              spellCheck="false"
            />
          </div>
          <div className={styles.row}>
            <label>Property:</label>
            <select
              name="property"
              className={styles.select}
              value={selectedProperty}
              onChange={(event) => {
                const newPropId = Number(event.target.value);
                setSelectedProperty(newPropId);
                setSelectedUnit("");
              }}
            >
              {Object.values(properties).map((property) => (
                <option key={property.id} value={property.id}>
                  {property.property_name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <label>Unit:</label>
            <select
              name="unit"
              className={styles.select}
              value={selectedUnit}
              onChange={(event) => setSelectedUnit(Number(event.target.value))}
            >
              <option value="">Select a unit</option>
              {filteredUnits.map((unit) => (
                <option key={unit.id} value={unit.unit_number}>
                  {unit.unit_number}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <label>Username: </label>
            <input
              className={styles.input}
              name="username"
              type="text"
              placeholder="username"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <div className={styles.row}>
            <label>Email:</label>
            <input
              className={styles.input}
              name="email"
              type="text"
              placeholder="email"
            />
          </div>
          <div className={styles.row}>
            <label>Password: </label>
            <input
              className={styles.input}
              name="password"
              type="password"
              placeholder="password"
              autoComplete="new-password"
              spellCheck="false"
            />
          </div>
          <div className={styles.row}>
            <label>Confirm Password: </label>
            <input
              className={styles.input}
              name="confPassword"
              type="password"
              placeholder="confirm password"
              autoComplete="new-password"
              spellCheck="false"
            />
          </div>
          <div className={styles.buttons}>
            <button className={styles.cancelButton} onClick={onCancel}>
              cancel
            </button>
            <button className={styles.submitButton} type="submit">
              create
            </button>
          </div>
        </form>
      </div>
    );

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.row}>
          <label>First: </label>
          <input
            className={styles.nameInput}
            name="first"
            type="text"
            defaultValue={user.first_name}
            spellCheck="false"
          />
        </div>
        <div className={styles.row}>
          <label>Last: </label>
          <input
            className={styles.nameInput}
            name="last"
            type="text"
            defaultValue={user.last_name}
            spellCheck="false"
          />
        </div>
        <div className={styles.row}>
          <label>Property:</label>
          <select
            name="property"
            className={styles.select}
            value={selectedProperty}
            onChange={(event) => {
              const newPropId = Number(event.target.value);
              setSelectedProperty(newPropId);
              setSelectedUnit("");
            }}
          >
            {Object.values(properties).map((property) => (
              <option key={property.id} value={property.id}>
                {property.property_name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.row}>
          <label>Unit:</label>
          <select
            name="unit"
            className={styles.select}
            value={selectedUnit}
            onChange={(event) => setSelectedUnit(Number(event.target.value))}
          >
            <option value={selectedUnit}>{selectedUnit}</option>
            {filteredUnits.map((unit) => (
              <option key={unit.id} value={unit.unit_number}>
                {unit.unit_number}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.row}>
          <label>Username: </label>
          <input
            className={styles.input}
            name="username"
            type="text"
            defaultValue={user.username}
            spellCheck="false"
          />
        </div>
        <div className={styles.row}>
          <label>Email:</label>
          <input
            className={styles.input}
            name="email"
            type="text"
            defaultValue={user.email}
            spellCheck="false"
          />
        </div>
        <div className={styles.row}>
          <label>Manager:</label>
          <select className={styles.select} name="is-manager">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className={styles.row}>
          <label>Active user:</label>
          <select className={styles.select} name="is-active">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            cancel
          </button>
          <button className={styles.submitButton} type="submit">
            update
          </button>
        </div>
      </form>
    </div>
  );
}
