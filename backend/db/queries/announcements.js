import pool from "#db/client";

export async function createAnnouncements(
  date,
  announcement,
  owner,
  announcement_type
) {
  const sql = `INSERT INTO announcements(date, announcement, owner, announcement_type)
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const {
    rows: [announcements],
  } = await pool.query(sql, [date, announcement, owner, announcement_type]);
  return announcements;
}

export async function getAnnouncements() {
  const sql = `SELECT * FROM announcements`;
  const { rows: announcements } = await pool.query(sql);
  return announcements;
}

export async function getAnnouncementById(id) {
  const sql = `SELECT * FROM announcements
    WHERE id = $1`;
  const { rows: announcement } = await pool.query(sql, [id]);
  return announcement;
}
