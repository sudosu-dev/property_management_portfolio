import pool from "#db/client";

export async function createAnnouncements(
  date,
  announcement,
  userId,
  announcement_type
) {
  const sql = `INSERT INTO announcements(date, announcement, user_id, announcement_type)
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const {
    rows: [newAnnouncements],
  } = await pool.query(sql, [date, announcement, userId, announcement_type]);
  return newAnnouncements;
}

export async function getAnnouncements() {
  const sql = `SELECT * FROM announcements`;
  const { rows: announcements } = await pool.query(sql);
  return announcements;
}

export async function getAnnouncementById(id) {
  const sql = `SELECT * FROM announcements
    WHERE id = $1`;
  const {
    rows: [announcement],
  } = await pool.query(sql, [id]);
  return announcement;
}

export async function updateAnnouncementById(
  id,
  date,
  announcement,
  userId,
  announcement_type
) {
  const sql = `UPDATE announcements
    SET
        date = $2,
        announcement = $3,
        user_id = $4,
        announcement_type = $5
    WHERE id = $1 RETURNING *    
    `;
  const {
    rows: [updateAnnouncement],
  } = await pool.query(sql, [
    id,
    date,
    announcement,
    userId,
    announcement_type,
  ]);
  return updateAnnouncement;
}

export async function deleteAnnouncementById(id) {
  const sql = `DELETE FROM announcements WHERE id = $1`;
  await pool.query(sql, [id]);
}
