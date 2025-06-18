import pool from "#db/client";

export async function getRentChargesByUserId(userId) {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.unit AS unit_id,
      units.rent_amount,
      u.created_at
    FROM users u
    JOIN units ON u.unit = units.id
    WHERE u.id = $1
  `;
  const { rows } = await pool.query(sql, [userId]);
  return rows;
}
