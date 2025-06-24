import pool from "#db/client";
import bcrypt from "bcrypt";

export const getUserByIdForAuth = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export async function getUserById(id) {
  const sql = `SELECT * FROM users WHERE id = $1`;
  const {
    rows: [user],
  } = await pool.query(sql, [id]);
  return user;
}
// POST /users and /users/register
// create user
export async function createUser({
  username,
  password,
  firstName,
  lastName,
  email,
  unit,
  isManager,
}) {
  // ** NOTE TO TEAM **
  // setting is_current_user to true automatically because if your creating a user they
  // are current. if you're deactivating a user (in another function then it can be set
  // to false at that point). If you want to be able to create a user who isn't active
  // then change true to $6 in values
  const sql = `
    INSERT INTO users (username, password_hash, first_name, last_name, email, unit, is_manager, is_current_user)
    VALUES ($1, $2, $3, $4, $5, $6, $7, true)
    RETURNING id, username, first_name, last_name, email, unit, is_manager, created_at
    `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const values = [
    username,
    hashedPassword,
    firstName,
    lastName,
    email,
    unit,
    isManager,
  ];

  const {
    rows: [user],
  } = await pool.query(sql, values);
  return user;
}

// POST /user/login
// getUserByUsernameAndPassword
export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
        SELECT id, username, first_name, last_name, email, unit, is_manager, created_at, password_hash
        FROM users 
        WHERE username = $1
    `;

  const {
    rows: [user],
  } = await pool.query(sql, [username]);

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  // remove the password and return the user object without the password
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// GET /users/:id
// getUserById
// role based access -
// - you have to be logged in (we can handle that here or in the route or in both places).
// - a user can only view their own profile
// - conditional sql statements based on role
export async function getUserByIdSecure(userId, requestingUser) {
  let sql;

  if (!requestingUser) {
    throw new Error("Authentication required.");
  }

  if (!requestingUser.is_manager && requestingUser.id !== parseInt(userId)) {
    throw new Error("Access denied - you can only view your own profile.");
  }

  if (requestingUser.is_manager) {
    sql = `
        SELECT id, first_name, last_name, email, unit, is_manager, is_current_user, created_at
        FROM users
        WHERE id = $1
        `;
  } else {
    sql = `
        SELECT id, first_name, last_name, email, unit, is_manager, created_at
        FROM users
        WHERE id = $1
        `;
  }

  const {
    rows: [user],
  } = await pool.query(sql, [userId]);
  return user;
}

// PUT users/:id
// updateUser
export async function updateUserById(userId, updates, requestingUser) {
  if (!requestingUser) {
    throw new Error("Authentication required.");
  }

  if (!requestingUser.is_manager && requestingUser.id !== parseInt(userId)) {
    throw new Error("Access denied - you can only update your own profile");
  }

  const userAllowedFields = ["firstName", "lastName", "email", "phone"];
  const managerAllowedFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "unit",
    "isManager",
    "isCurrentUser",
  ];

  const allowedUpdateFields = requestingUser.is_manager
    ? managerAllowedFields
    : userAllowedFields;

  const mapToDbColumn = (key) => {
    const mapping = {
      firstName: "first_name",
      lastName: "last_name",
      isManager: "is_manager",
      isCurrentUser: "is_current_user",
    };
    return mapping[key] || key;
  };

  const fields = [];
  const values = [];
  let counter = 1;

  for (const key in updates) {
    if (updates[key] !== undefined && updates[key] !== null) {
      if (allowedUpdateFields.includes(key)) {
        const value = updates[key];
        const dbColumn = mapToDbColumn(key);
        fields.push(`${dbColumn} = $${counter++}`);
        values.push(value);
      }
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update.");
  }

  values.push(userId);

  const sql = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${counter}
    RETURNING id, username, first_name, last_name, email, unit, is_manager, created_at
    `;

  const {
    rows: [user],
  } = await pool.query(sql, values);
  return user;
}

// DELETE /users/:id
// deleteUser
export async function deleteUser(userId, requestingUser) {
  if (!requestingUser) {
    throw new Error("Authentication required.");
  }

  if (!requestingUser.is_manager) {
    throw new Error("Access denied - only managers can delete users.");
  }

  if (requestingUser.id === parseInt(userId)) {
    throw new Error("You can not delete yourself.");
  }

  const sql = `
    UPDATE users
    SET is_current_user = false
    WHERE id = $1 AND is_current_user = true
    `;

  await pool.query(sql, [userId]);
}

// GET /users
// getAllUsers
export async function getAllUsers(requestingUser) {
  if (!requestingUser) {
    throw new Error("Authentication required.");
  }

  if (!requestingUser.is_manager) {
    throw new Error("Access denied.");
  }
  const sql = `
        SELECT id, username, first_name, last_name, email, unit, is_manager, is_current_user, created_at
        FROM users
        ORDER BY username
    `;

  const { rows } = await pool.query(sql);
  return rows;
}

export async function getUserWithUnitNumber(userId) {
  const sql = `
  SELECT
  users.id,
  users.first_name,
  users.last_name,
  users.email,
  users.unit AS unit_id,
  users.is_manager,
  users.created_at,
  units.unit_number
  FROM users
  JOIN units ON users.unit = units.id
  WHERE users.id = $1
  `;

  const {
    rows: [user],
  } = await pool.query(sql, [userId]);
  return user;
}
