import { useState, useEffect } from "react";
import { useUsers } from "../../Context/UsersContext";

export default function EditUserForm({
  user,
  unit,
  units,
  properties,
  property,
  onCancel,
}) {
  const { loading, putUser, getUsers } = useUsers();

  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(property?.id);
  const [selectedUnit, setSelectedUnit] = useState(unit?.unit_number);

  useEffect(() => {
    if (!property || !units) return;

    const unitsByProperty = Object.values(units).filter(
      (unit) => unit.property_id === property.id
    );
    setFilteredUnits(unitsByProperty);
  }, [property, units]);

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

  useEffect(() => {
    if (unit?.unit_number) {
      setSelectedUnit(unit.unit_number);
    }
  }, [unit]);

  if (loading) return null;

  if (!user || !unit || !units || !properties || !property) return null;

  return (
    <div>
      <h2>Edit User Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            First:{" "}
            <input name="first" type="text" defaultValue={user.first_name} />
          </label>
          <label>
            Last:{" "}
            <input name="last" type="text" defaultValue={user.last_name} />
          </label>
        </div>
        <div>
          <label>Property: </label>
          <select
            name="property"
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
          <label>Unit: </label>
          <select
            name="unit"
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
        <div>
          <label>
            Username:{" "}
            <input name="username" type="text" defaultValue={user.username} />
          </label>
          <label>
            Email: <input name="email" type="text" defaultValue={user.email} />
          </label>
          <div>
            <label>Manager: </label>
            <select name="is-manager">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            <label>Active user: </label>
            <select name="is-active">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <button onClick={onCancel}>cancel</button>
            <button type="submit">post</button>
          </div>
        </div>
      </form>
    </div>
  );
}
