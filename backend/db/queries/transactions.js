import pool from "#db/client";

export async function getUserBalance(userId) {
  const sql = `SELECT SUM(amount) as balance FROM transactions WHERE user_id = $1;`;
  const result = await pool.query(sql, [userId]);
  return parseFloat(result.rows[0]?.balance) || 0;
}

export async function createCharge(userId, unitId, type, description, amount) {
  const sql = `INSERT INTO transactions (user_id, unit_id, type, description, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const {
    rows: [newCharge],
  } = await pool.query(sql, [userId, unitId, type, description, amount]);
  return newCharge;
}

export async function recordStripePayment(paymentIntent) {
  const { userId, unitId } = paymentIntent.metadata;
  const amountPaid = paymentIntent.amount / 100;
  const stripeId = paymentIntent.id;

  const sql = `INSERT INTO transactions (user_id, unit_id, type, description, amount, stripe_payment_id) VALUES ($1, $2, 'Payment', 'Online payment via Stripe', $3, $4) RETURNING *;`;
  const {
    rows: [newPayment],
  } = await pool.query(sql, [userId, unitId, -amountPaid, stripeId]);
  return newPayment;
}

export async function postUnbilledUtilitiesToLedger() {
  const findUnpostedSql = `
    SELECT ui.id, ui.user_id, ui.due_date, u.unit as unit_id,
      (COALESCE(ui.water_cost, 0) + COALESCE(ui.electric_cost, 0) + COALESCE(ui.gas_cost, 0)) as total_amount
    FROM utility_information ui JOIN users u ON ui.user_id = u.id
    WHERE ui.is_posted_to_ledger = false;
  `;
  const { rows: billsToPost } = await pool.query(findUnpostedSql);

  for (const bill of billsToPost) {
    if (bill.total_amount > 0) {
      const month = new Date(bill.due_date).toLocaleString("default", {
        month: "long",
      });
      await createCharge(
        bill.user_id,
        bill.unit_id,
        "Utility",
        `Utilities for ${month} (Ref ID: ${bill.id})`,
        bill.total_amount
      );

      const markAsPostedSql = `UPDATE utility_information SET is_posted_to_ledger = true WHERE id = $1;`;
      await pool.query(markAsPostedSql, [bill.id]);
    }
  }
}

export async function getTransactionsByUserId(userId) {
  const sql = `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC;`;
  const { rows } = await pool.query(sql, [userId]);
  return rows;
}
