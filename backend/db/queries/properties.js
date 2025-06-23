import pool from "#db/client";

export async function createProperty({
  propertyName,
  address,
  phoneNumber,
  totalUnits,
}) {
  const sql = `
    INSERT INTO properties (property_name, address, phone_number, total_units)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const {
    rows: [property],
  } = await pool.query(sql, [propertyName, address, phoneNumber, totalUnits]);
  return property;
}

export async function getProperties() {
  const sql = `SELECT * FROM properties`;
  const { rows } = await pool.query(sql);
  return rows;
}

export async function getPropertyById(propertyId) {
  const sql = `SELECT * FROM properties WHERE id = $1`;
  const {
    rows: [property],
  } = await pool.query(sql, [propertyId]);
  return property;
}

export async function getPropertyByName(propertyName) {
  const sql = `SELECT * FROM properties WHERE property_name = $1`;
  const {
    rows: [property],
  } = await pool.query(sql, [propertyName]);
  return property;
}

export async function updateProperty(id, updates) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in updates) {
    fields.push(`${key} = $${index}`);
    values.push(updates[key]);
    index++;
  }

  const result = await pool.query(
    `UPDATE properties SET ${fields.join(
      ", "
    )} WHERE id = $${index} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
}

export async function deleteProperty(propertyId) {
  const sql = `
    DELETE FROM properties
    WHERE id = $1
    RETURNING *;
  `;
  const {
    rows: [deletedProperty],
  } = await pool.query(sql, [propertyId]);
  return deletedProperty;
}
