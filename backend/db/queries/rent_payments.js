import pool from "#db/client";

export async function createRentPayment(data) {
  const { due_date, paid_date, receipt_number, payment_amount, user_id, unit } =
    data;

  const sql = `
    INSERT INTO rent_payments
    (due_date, paid_date, receipt_number, payment_amount, user_id, unit)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    due_date,
    paid_date,
    receipt_number,
    payment_amount,
    user_id,
    unit,
  ];

  const {
    rows: [rentPayment],
  } = await pool.query(sql, values);

  return rentPayment;
}

export async function getAllRentPayments() {
  const sql = `
    SELECT rp.*, u.first_name, u.last_name, u.unit as user_unit
    FROM rent_payments rp
    JOIN users u ON rp.user_id = u.id
    ORDER BY rp.due_date DESC
  `;
  const { rows } = await pool.query(sql);
  return rows;
}

export async function getRentPaymentsByUserId(userId) {
  const sql = `
    SELECT * FROM rent_payments
    WHERE user_id = $1
    ORDER BY due_date DESC
  `;
  const { rows } = await pool.query(sql, [userId]);
  return rows;
}

export async function updateRentPaymentById(id, updates) {
  const allowedFields = [
    "due_date",
    "paid_date",
    "receipt_number",
    "payment_amount",
    "user_id",
    "unit",
  ];

  const fields = [];
  const values = [];
  let counter = 1;

  for (const key in updates) {
    if (updates[key] !== undefined && allowedFields.includes(key)) {
      fields.push(`${key} = $${counter++}`);
      values.push(updates[key]);
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update.");
  }

  values.push(id);

  const sql = `
    UPDATE rent_payments
    SET ${fields.join(", ")}
    WHERE id = $${counter}
    RETURNING *
  `;

  const {
    rows: [rentPayment],
  } = await pool.query(sql, values);

  return rentPayment;
}

export async function deleteRentPayment(id) {
  const sql = `
    DELETE FROM rent_payments
    WHERE id = $1
    RETURNING *
  `;

  const {
    rows: [deleted],
  } = await pool.query(sql, [id]);

  return deleted;
}
