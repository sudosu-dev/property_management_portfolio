import pool from "#db/client";

export async function getSettings() {
  const { rows } = await pool.query("SELECT key, value FROM settings;");

  const settingsObject = rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return settingsObject;
}

export async function updateSettings(settings) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const settingsToUpdate = Object.entries(settings);

    for (const [key, value] of settingsToUpdate) {
      const sql = `
                INSERT INTO settings (key, value)
                VALUES ($1, $2)
                ON CONFLICT (key)
                DO UPDATE SET value = EXCLUDED.value
            `;

      await client.query(sql, [key, value]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
