import { useEffect, useState } from "react";
import { useUsers } from "../../Context/UsersContext";
import { useApi } from "../../api/ApiContext";
import EditUserForm from "./EditUserForm";
import styles from "./ManageUsers.module.css";

export default function ManageUsers() {
  const { users, loading, getUsers } = useUsers();
  const { request } = useApi();

  const [searchFilter, setSearchFilter] = useState("first_name");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [units, setUnits] = useState({});
  const [properties, setProperties] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedPropery, setSelectedProperty] = useState(null);
  const [renderEdit, setRenderEdit] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function awaitUsers() {
      await getUsers();
    }
    awaitUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        const value = user[searchFilter];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (typeof value === "number") {
          return value.toString().includes(searchQuery);
        }
        return false;
      })
    );
  }, [searchFilter, searchQuery, users]);

  useEffect(() => {
    setPageLoading(true);
    const getUnitsAndProperties = async () => {
      const unitIds = [
        ...new Set(users.map((user) => user.unit).filter(Boolean)),
      ];
      const unitMap = {};
      const propertyIds = new Set();

      for (const unitId of unitIds) {
        try {
          const unit = await request(`/units/${unitId}`);
          unitMap[unitId] = unit;
          if (unit.property_id) propertyIds.add(unit.property_id);
        } catch (err) {
          console.log(`error loading unit ${unitId}:` + err);
        }
      }

      setUnits(unitMap);

      const propertyMap = {};
      for (const propertyId of propertyIds) {
        try {
          const property = await request(`/properties/${propertyId}`);
          propertyMap[propertyId] = property;
        } catch (err) {
          console.log(`error loading property ${propertyId}:` + err);
        }
      }

      setProperties(propertyMap);
    };

    getUnitsAndProperties();
    setPageLoading(false);
  }, [users, request]);

  if (loading) return <p>Loading page...</p>;
  if (pageLoading) return <p>Loading page...</p>;
  if (!users || users.length === 0) return <p>Fetching user information...</p>;

  return (
    <>
      <h1>Manage Users</h1>
      <div className={styles.search}>
        <input
          className={styles.searchBar}
          type="text"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search by ${searchFilter}`}
        />
        <select
          className={styles.searchDropDown}
          name="search-drop-down"
          value={searchFilter}
          onChange={(event) => setSearchFilter(event.target.value)}
        >
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
          <option value="username">Username</option>
          <option value="unit">Unit</option>
          <option value="email">Email</option>
        </select>
        <ul className={styles.cardContainer}>
          <li className={styles.rows}>
            <h3>Name</h3>
            <p>Username</p>
            <p>Property, Unit</p>
            <p>Email</p>
            <p>
              Joined on <span className={styles.dateInf}>(DD-MM-YYYY)</span>
            </p>
            <p>Edit</p>
          </li>
          {filteredUsers.slice(0, 49).map((user, i) => (
            <UserCard
              key={i}
              user={user}
              unit={units[user.unit]}
              property={
                units[user.unit]?.property_id
                  ? properties[units[user.unit].property_id]
                  : undefined
              }
              onEdit={() => {
                setSelectedUser(user);
                setSelectedUnit(units[user.unit]);
                setSelectedProperty(
                  units[user.unit]?.property_id
                    ? properties[units[user.unit].property_id]
                    : undefined
                );
                setRenderEdit(true);
              }}
            />
          ))}
        </ul>
      </div>
      {renderEdit && (
        <EditUserForm
          user={selectedUser}
          unit={selectedUnit}
          units={units}
          properties={properties}
          property={selectedPropery}
          onCancel={() => setRenderEdit(false)}
          onEdit={() => setRenderEdit(true)}
        />
      )}
    </>
  );
}

export function UserCard({ user, unit, property, onEdit }) {
  if (!user.is_current_user) return null;

  return (
    <li className={styles.card}>
      <h3>
        {user.first_name} {user.last_name}
      </h3>
      <p>{user.username}</p>
      <p>
        {property?.property_name ?? "Loading..."},{" "}
        {unit?.unit_number ?? "Loading..."}
      </p>
      <p>{user.email}</p>
      {user.is_manager && (
        <>
          <span className={styles.joinDate}>
            {(() => {
              const [year, month, day] = user.created_at
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>
          <p>Manager</p>
        </>
      )}

      {!user.is_manager && (
        <>
          <span className={styles.joinDate}>
            {" "}
            {(() => {
              const [year, month, day] = user.created_at
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>{" "}
          <button onClick={() => onEdit()}>edit</button>
        </>
      )}
    </li>
  );
}
