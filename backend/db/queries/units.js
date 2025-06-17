import pool from "#db/client";

// Create a new unit
export async function createUnit({
  propertyId,
  unitNumber,
  rentAmount = null,
  notes = null,
  tenants = null,
}) {
  const sql = `
    INSERT INTO units (property_id, unit_number, rent_amount, notes, tenants)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const {
    rows: [unit],
  } = await pool.query(sql, [
    propertyId,
    unitNumber,
    rentAmount,
    notes,
    tenants,
  ]);
  return unit;
}

// Get all units - from all properties
export async function getUnits() {
  const sql = `SELECT * FROM units`;
  const { rows } = await pool.query(sql);
  return rows;
}

// Get all units - from specified property ID
export async function getUnitsByPropertyId(propertyId) {
  const sql = `
    SELECT units.*, 
    properties.property_name
    FROM units
    JOIN properties ON units.property_id = properties.id
    WHERE properties.id = $1;
    `;
  const { rows } = await pool.query(sql, [propertyId]);
  return rows;
}

// Get single unit - from specified property ID and unit number
export async function getUnitsByPropertyIdAndUnitNumber(
  propertyId,
  unitNumber
) {
  const sql = `
    SELECT units.*, 
    properties.property_name
    FROM units
    JOIN properties ON units.property_id = properties.id
    WHERE units.property_id = $1 AND units.unit_number = $2;
    `;
  const {
    rows: [unit],
  } = await pool.query(sql, [propertyId, unitNumber]);
  return unit;
}

// Get single unit - from specified property ID and tenant name
export async function getUnitByPropertyIdAndTenantName(
  propertyId,
  residentName
) {
  const sql = `
    SELECT units.*, 
    properties.property_name
    FROM units
    JOIN properties ON units.property_id = properties.id
    WHERE units.property_id = $1 AND units.tenants ILIKE $2;
    `;
  const {
    rows: [unit],
  } = await pool.query(sql, [propertyId, residentName]);
  return unit;
}

// Update single unit
export async function updateUnit(id, updates) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in updates) {
    fields.push(`${key} = $${index}`);
    values.push(updates[key]);
    index++;
  }

  const result = await db.query(
    `UPDATE units SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
}

// Delete single unit
export async function deleteUnit(id) {
  const sql = `DELETE FROM units WHERE id = $1 RETURNING *`;
  const {
    rows: [unit],
  } = await pool.query(sql, [id]);
  return unit;
}
