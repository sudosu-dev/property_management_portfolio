import pool from "#db/client";

// Get rent charges for a given user (based on their unit's rent_amount)
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
  const {
    rows: [result],
  } = await pool.query(sql, [userId]);

  // Fake multiple rent charges (for example: last 3 months)
  const today = new Date();
  const rentCharges = Array.from({ length: 3 }).map((_, i) => {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i); // simulate past months

    return {
      user_id: result.user_id,
      unit_id: result.unit_id,
      rent_amount: result.rent_amount,
      created_at: date.toISOString(), // fake date for ledger
    };
  });

  return rentCharges;
}
