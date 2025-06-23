import { useEffect, useState } from "react";
import { useUsers } from "../../Context/UsersContext";
import { useApi } from "../../api/ApiContext";
import EditUserForm from "./EditUserForm";

export default function ManageUsers() {
  const { users, loading, getUsers, postUsers } = useUsers();
  const { request } = useApi();

  const [searchFilter, setSearchFilter] = useState("first_name");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [units, setUnits] = useState({});
  const [properties, setProperties] = useState({});

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
  }, [users, request]);

  if (loading) return <p>Loading page...</p>;

  return (
    <>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={`Search by ${searchFilter}`}
      />
      <select
        value={searchFilter}
        onChange={(event) => setSearchFilter(event.target.value)}
      >
        <option value="first_name">First Name</option>
        <option value="last_name">Last Name</option>
        <option value="username">Username</option>
        <option value="unit">Unit</option>
        <option value="email">Email</option>
      </select>
      {filteredUsers.slice(0, 19).map((user, i) => (
        <UserCard
          key={i}
          user={user}
          unit={units[user.unit]}
          property={
            units[user.unit]?.property_id
              ? properties[units[user.unit].property_id]
              : undefined
          }
        />
      ))}
      <EditUserForm user={users[1]} />
    </>
  );
}

export function UserCard({ user, unit, property }) {
  if (!user.is_current_user) return null;

  return (
    <li>
      <h3>
        {user.first_name} {user.last_name}
      </h3>
      <p>Username: {user.username}</p>
      <p>
        Property: {property?.property_name ?? "Loading..."} Unit:{" "}
        {unit?.unit_number ?? "Loading..."}
      </p>
      <p>Email: {user.email}</p>
      {user.is_manager && (
        <p>
          <span>
            {" "}
            User since:{" "}
            {(() => {
              const [year, month, day] = user.created_at
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>{" "}
          Manager
        </p>
      )}
      {!user.is_manager && (
        <>
          <span>
            {" "}
            User since:{" "}
            {(() => {
              const [year, month, day] = user.created_at
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>{" "}
          <button>edit</button>
        </>
      )}
    </li>
  );
}
