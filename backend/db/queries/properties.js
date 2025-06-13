import pool from "#db/client";

export async function createProperty({ propertyName }) {
  const sql = `
    INSERT INTO properties (property_name)
    VALUES ($1)
    RETURNING *;
  `;
  const {
    rows: [property],
  } = await pool.query(sql, [propertyName]);
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
