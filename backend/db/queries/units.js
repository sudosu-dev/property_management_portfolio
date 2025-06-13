import pool from "#db/client";

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

export async function getUnits() {
  const sql = `SELECT * FROM units`;
  const { rows } = await pool.query(sql);
  return rows;
}

export async function getUnitsByPropertyId(propertyId) {
  const sql = `
    SELECT units.*, 
    properties.property_name
    FROM units
    JOIN properties ON units.property_id = properties.property_id;
    `;
  const { rows } = await pool.query(sql, [propertyId]);
  return rows;
}

export async function getUnitsByPropertyIdAndUnitNumber(
  propertyId,
  unitNumber
) {
  const sql = `
    SELECT units.*, 
    properties.property_name
    FROM units
    JOIN properties ON units.property_id = properties.property_id
    WHERE units.property_id = $1 AND units.unit_number = $2;
    `;
  const {
    rows: [unit],
  } = await pool.query(sql, [propertyId, unitNumber]);
  return unit;
}

export async function getUnitByPropertyIdAndTenantName(
  propertyId,
  residentName
) {
  const sql = `
    SELECT units.*, 
    properties.property_name
    FROM units
    JOIN properties ON units.property_id = properties.property_id
    WHERE units.property_id = $1 AND units.tenants ILIKE $2;
    `;
  const {
    rows: [unit],
  } = await pool.query(sql, [propertyId, residentName]);
  return unit;
}

// --- INSERT UPDATE UNIT FUNCTION HERE ---

export async function deleteUnit(id) {
  const sql = `DELETE FROM units WHERE id = $1 RETURNING *`;
  const {
    rows: [unit],
  } = await pool.query(sql, [id]);
  return unit;
}
