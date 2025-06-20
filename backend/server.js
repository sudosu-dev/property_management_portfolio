import app from "#app";
import pool from "#db/client";
import { startCronJobs } from "#utilities/cronJobs";

const PORT = process.env.PORT ?? 8000;

await pool.connect();

startCronJobs();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
