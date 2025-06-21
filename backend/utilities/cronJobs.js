import cron from "node-cron";
import pool from "#db/client";
import {
  createCharge,
  postUnbilledUtilitiesToLedger,
} from "#db/queries/transactions";
import { reconcileUtilityPaidStatus } from "#db/queries/reconciliation";

async function generateMonthlyRentCharges() {
  const month = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const activeTenantsSql = `
    SELECT u.id as user_id, u.unit as unit_id, un.rent_amount
    FROM users u JOIN units un ON u.unit = un.id
    WHERE u.is_current_user = true AND un.rent_amount > 0;
  `;
  const { rows: tenants } = await pool.query(activeTenantsSql);

  for (const tenant of tenants) {
    await createCharge(
      tenant.user_id,
      tenant.unit_id,
      "Rent",
      `Monthly Rent for ${month}`,
      tenant.rent_amount
    );
  }
}

export function startCronJobs() {
  const timezone = "America/Chicago";

  cron.schedule("0 2 1 * *", generateMonthlyRentCharges, { timezone });
  cron.schedule("0 * * * *", postUnbilledUtilitiesToLedger, { timezone });
  cron.schedule("0 3 * * *", reconcileUtilityPaidStatus, { timezone });
}
