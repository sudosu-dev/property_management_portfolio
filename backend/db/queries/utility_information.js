import pool from "#db/client";

export async function createUtility_information({
  user_id,
  water_cost = null,
  water_usage = null,
  electric_usage = null,
  electric_cost = null,
  gas_cost = null,
  gas_usage = null,
  due_date = null,
  paid_date = null,
}) {
  const sql = `INSERT INTO utility_information(user_id, water_cost, water_usage, electric_usage, electric_cost, gas_cost, gas_usage, due_date, paid_date)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *`;
  const {
    rows: [utility_information],
  } = await pool.query(sql, [
    user_id,
    water_cost,
    water_usage,
    electric_usage,
    electric_cost,
    gas_cost,
    gas_usage,
    due_date,
    paid_date,
  ]);
  return utility_information;
}

export async function getUtility_informationByUserIdAndPaidStatus(user_id) {
  const sql = `SELECT * FROM utility_information
  WHERE user_id = $1 AND paid = false`;
  const { rows: utility_information } = await pool.query(sql, [user_id]);
  return utility_information;
}

export async function getUtility_informationByUserId(user_id) {
  const sql = `SELECT * FROM utility_information
  WHERE user_id = $1`;
  const { rows: utility_information } = await pool.query(sql, [user_id]);
  return utility_information;
}

export async function getAllUtility_information() {
  const sql = `SELECT * FROM utility_information`;
  const { rows: utility_information } = await pool.query(sql);
  return utility_information;
}

export async function getAllUnpaidUtility_information() {
  const sql = `SELECT * FROM utility_information WHERE paid = false`;
  const { rows: utility_information } = await pool.query(sql);
  return utility_information;
}

export async function updateUtility_informationPaidStatusByUserId(
  bool,
  user_id
) {
  if (typeof bool !== "boolean") return null;
  const sql = `UPDATE utility_information SET paid = $1 WHERE user_id = $2 RETURNING *`;
  const {
    rows: [utility_information],
  } = await pool.query(sql, [bool, user_id]);
  return utility_information;
}

export async function createBatchUtilityBills(bills) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const createdBills = [];
    for (const bill of bills) {
      const sql = `
        INSERT INTO utility_information (user_id, water_cost, water_usage, electric_usage, electric_cost, gas_cost, gas_usage, due_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [
        bill.user_id,
        bill.water_cost,
        bill.water_usage,
        bill.electric_usage,
        bill.electric_cost,
        bill.gas_cost,
        bill.gas_usage,
        bill.due_date,
      ];
      const {
        rows: [newBill],
      } = await client.query(sql, values);
      createdBills.push(newBill);
    }
    await client.query("COMMIT");
    return createdBills;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
