import pool from "#db/client";
import { getUserBalance } from "./transactions.js";

export async function reconcileUtilityPaidStatus() {
  const getUsersSql = `SELECT DISTINCT user_id FROM utility_information WHERE paid = false;`;
  const { rows: users } = await pool.query(getUsersSql);

  for (const user of users) {
    const userId = user.user_id;
    const balance = await getUserBalance(userId);

    if (balance <= 0) {
      const updateSql = `UPDATE utility_information SET paid = true WHERE user_id = $1 AND paid = false;`;
      await pool.query(updateSql, [userId]);
    }
  }
}
