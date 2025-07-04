import { useEffect, useState } from "react";
import { useUsers } from "../../Context/UsersContext";
import { useApi } from "../../api/ApiContext";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";
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
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setSelectedUnit(units[user.unit]);
    setSelectedProperty(
      units[user.unit]?.property_id
        ? properties[units[user.unit].property_id]
        : undefined
    );
    setShowEditModal(true);
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowCreateModal(false);
    setSelectedUser(null);
    setSelectedUnit(null);
    setSelectedProperty(null);
  };

  const handleSuccess = async () => {
    await getUsers();
    handleCloseModals();
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading users"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading page data"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading page data...</p>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h2>No Users Found</h2>
          <p>There are no users to display at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <header className={styles.mainHeader}>
          <h1 className={styles.mainH1}>Manage Users</h1>
          <button
            className={styles.createButton}
            onClick={handleCreateUser}
            aria-label="Open create new user form"
          >
            + Create User
          </button>
        </header>

        <main className={styles.content}>
          <div className={styles.search}>
            <input
              className={styles.searchBar}
              type="text"
              name="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search by ${searchFilter.replace("_", " ")}`}
              aria-label={`Search users by ${searchFilter.replace("_", " ")}`}
            />
            <select
              className={styles.searchDropDown}
              name="search-drop-down"
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
              aria-label="Select search filter category"
            >
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="username">Username</option>
              <option value="unit">Unit</option>
              <option value="email">Email</option>
            </select>
          </div>

          {/* Desktop Table View */}
          <div className={styles.desktopView}>
            <ul
              className={styles.cardContainer}
              role="table"
              aria-label="Users management table"
            >
              <li className={styles.rows} role="row">
                <h3 role="columnheader">Name</h3>
                <p role="columnheader">Username</p>
                <p role="columnheader">Property, Unit</p>
                <p role="columnheader">Email</p>
                <p role="columnheader">Date Created</p>
                <p role="columnheader">Actions</p>
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
                  onEdit={() => handleEditUser(user)}
                />
              ))}
            </ul>
          </div>

          {/* Mobile Card View */}
          <div className={styles.mobileView}>
            <ul className={styles.userCardsList} role="list">
              {filteredUsers.slice(0, 49).map((user, i) => (
                <UserCardMobile
                  key={i}
                  user={user}
                  unit={units[user.unit]}
                  property={
                    units[user.unit]?.property_id
                      ? properties[units[user.unit].property_id]
                      : undefined
                  }
                  onEdit={() => handleEditUser(user)}
                />
              ))}
            </ul>
          </div>
        </main>
      </div>

      {showEditModal && (
        <EditUserModal
          user={selectedUser}
          unit={selectedUnit}
          units={units}
          properties={properties}
          property={selectedProperty}
          onClose={handleCloseModals}
          onSuccess={handleSuccess}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          units={units}
          properties={properties}
          onClose={handleCloseModals}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

export function UserCard({ user, unit, property, onEdit }) {
  if (!user.is_current_user) return null;

  return (
    <li className={styles.card} role="row">
      <h3 role="cell">
        {user.first_name} {user.last_name}
      </h3>
      <p role="cell">{user.username}</p>
      <p role="cell">
        {property?.property_name ?? "Loading..."},{" "}
        {unit?.unit_number ?? "Loading..."}
      </p>
      <p role="cell">{user.email}</p>
      {user.is_manager && (
        <>
          <span className={styles.joinDate} role="cell">
            {(() => {
              const [year, month, day] = user.created_at
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>
          <p role="cell">Manager</p>
        </>
      )}

      {!user.is_manager && (
        <>
          <span className={styles.joinDate} role="cell">
            {" "}
            {(() => {
              const [year, month, day] = user.created_at
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>{" "}
          <div className={styles.buttonContainer} role="cell">
            <button
              className={styles.editButton}
              onClick={() => onEdit()}
              aria-label={`Edit user ${user.first_name} ${user.last_name}`}
            >
              edit
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export function UserCardMobile({ user, unit, property, onEdit }) {
  if (!user.is_current_user) return null;

  return (
    <li className={styles.userCardMobile}>
      <div className={styles.cardHeader}>
        <h3>
          {user.first_name} {user.last_name}
        </h3>
        {user.is_manager && (
          <span className={styles.managerBadge}>Manager</span>
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>Username:</span>
          <span className={styles.fieldValue}>{user.username}</span>
        </div>

        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>Property, Unit:</span>
          <span className={styles.fieldValue}>
            {property?.property_name ?? "Loading..."},{" "}
            {unit?.unit_number ?? "Loading..."}
          </span>
        </div>

        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>Email:</span>
          <span className={styles.fieldValue}>{user.email}</span>
        </div>

        <div className={styles.cardField}>
          <span className={styles.fieldLabel}>Date Created:</span>
          <span className={styles.fieldValue}>
            {(() => {
              const [year, month, day] = user.created_at
                .slice(0, 10)
                .split("-");
              return `${day}-${month}-${year}`;
            })()}
          </span>
        </div>
      </div>

      {!user.is_manager && (
        <div className={styles.cardActions}>
          <button
            className={styles.editButtonMobile}
            onClick={() => onEdit()}
            aria-label={`Edit user ${user.first_name} ${user.last_name}`}
          >
            Edit User
          </button>
        </div>
      )}
    </li>
  );
}
