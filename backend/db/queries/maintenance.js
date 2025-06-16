import pool from "#db/client";

export async function createMaintenanceRequest({
  information,
  userId,
  unitId,
}) {
  const sql = `
        INSERT INTO maintenance_requests (information, user_id, unit_number)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  const values = [information, userId, unitId];

  const {
    rows: [newRequest],
  } = await pool.query(sql, values);
  return newRequest;
}

export async function addMaintenancePhoto(requestId, photoUrl) {
  const sql = `
        INSERT INTO maintenance_photos (maintenance_request_id, photo_url)
        VALUES ($1, $2)
        RETURNING *;
    `;
  const values = [requestId, photoUrl];

  const {
    rows: [photo],
  } = await pool.query(sql, values);
  return photo;
}

export async function getMaintenanceRequests(user, filters = {}) {
  let paramIndex = 1;
  const values = [];
  const clauses = [];

  if (!user.is_manager) {
    clauses.push(`mr.user_id = $${paramIndex++}`);
    values.push(user.id);
  }

  if (filters.completed !== undefined) {
    clauses.push(`mr.completed = $${paramIndex++}`);
    values.push(filters.completed);
  }
  if (user.is_manager && filters.unitId) {
    clauses.push(`mr.unit_number = $${paramIndex++}`);
    values.push(filters.unitId);
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  const sql = `
    SELECT
      mr.*,
      COALESCE(
        (SELECT json_agg(ph) FROM maintenance_photos ph WHERE ph.maintenance_request_id = mr.id),
        '[]'::json
      ) as photos
    FROM maintenance_requests mr
    ${whereSql}
    ORDER BY mr.created_at DESC;
  `;

  const { rows } = await pool.query(sql, values);
  return rows;
}

/**
 * Retrieves a single maintenance request by its ID.
 * @param {number} requestId - The ID of the request to retrieve.
 * @returns {Promise<object|null>} The request object or null if not found.
 */
export async function getMaintenanceRequestById(requestId) {
  const sql = `
    SELECT
      mr.*,
      COALESCE(
        (SELECT json_agg(ph) FROM maintenance_photos ph WHERE ph.maintenance_request_id = mr.id),
        '[]'::json
      ) as photos
    FROM maintenance_requests mr
    WHERE mr.id = $1;
  `;
  const {
    rows: [request],
  } = await pool.query(sql, [requestId]);
  return request;
}

export async function updateMaintenanceRequestCompletion(requestId, updates) {
  const { completed } = updates;
  const fields = [];
  const values = [];
  let counter = 1;

  if (completed !== undefined) {
    fields.push(`completed = $${counter++}`);
    values.push(completed);
    fields.push(`completed_at = $${counter++}`);
    values.push(completed ? new Date() : null);
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update.");
  }

  values.push(requestId);

  const sql = `
    UPDATE maintenance_requests
    SET ${fields.join(", ")}
    WHERE id = $${counter}
    RETURNING *;
  `;

  const {
    rows: [updatedRequest],
  } = await pool.query(sql, values);
  return updatedRequest;
}

export async function updateMaintenanceRequestById(requestId, updates, user) {
  const fields = [];
  const values = [];
  let counter = 1;

  const residentAllowedFields = ["information"];
  const managerAllowedFields = ["information", "unitNumber"];
  const allowedFields = user.is_manager
    ? managerAllowedFields
    : residentAllowedFields;

  const mapToDbColumn = (key) => {
    const mapping = {
      unitNumber: "unit_number",
    };
    return mapping[key] || key;
  };

  for (const key in updates) {
    if (allowedFields.includes(key)) {
      const dbColumn = mapToDbColumn(key);
      fields.push(`${dbColumn} = $${counter++}`);
      values.push(updates[key]);
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  values.push(requestId);

  const sql = `
    UPDATE maintenance_requests
    SET ${fields.join(", ")}
    WHERE id = $${counter}
    RETURNING *;
  `;

  const {
    rows: [updatedRequest],
  } = await pool.query(sql, values);
  return updatedRequest;
}
// make an update one to all fields function
// rename the current update function to show it just handles completion
// have an endpoint for completion and an endpoint for updates
