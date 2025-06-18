import app from "#app";
import pool from "#db/client";

const PORT = process.env.PORT ?? 8000;

await pool.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
