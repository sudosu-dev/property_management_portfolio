import pool from "#db/client";

export async function createAnnouncements(
  date,
  announcement,
  user_id,
  announcement_type
) {
  const sql = `
        INSERT INTO announcements(date, announcement, user_id, announcement_type, status, publish_at)
        VALUES ($1, $2, $3, $4, 'approved', $5)
        RETURNING *;
    `;
  const {
    rows: [newAnnouncement],
  } = await pool.query(sql, [
    date,
    announcement,
    user_id,
    announcement_type,
    date,
  ]);
  return newAnnouncement;
}

export async function getAnnouncements() {
  const sql = `
        SELECT a.*, u.first_name, u.last_name
        FROM announcements a
        JOIN users u ON a.user_id = u.id
        WHERE a.status = 'approved' AND a.publish_at <= NOW()
        ORDER BY a.publish_at DESC;
    `;
  const { rows: announcements } = await pool.query(sql);
  return announcements;
}

export async function getAnnouncementById(id) {
  const sql = `
        SELECT a.*, u.first_name, u.last_name
        FROM announcements a
        JOIN users u ON a.user_id = u.id
        WHERE a.id = $1;
    `;
  const {
    rows: [announcement],
  } = await pool.query(sql, [id]);
  return announcement;
}

export async function updateAnnouncementById(id, updates) {
  const { announcement, announcement_type, publish_at, date } = updates;
  const sql = `
        UPDATE announcements
        SET
            announcement = $2,
            announcement_type = $3,
            publish_at = $4,
            date = $5
        WHERE id = $1 RETURNING *;
    `;
  const {
    rows: [updateAnnouncement],
  } = await pool.query(sql, [
    id,
    announcement,
    announcement_type,
    publish_at,
    date,
  ]);
  return updateAnnouncement;
}

export async function deleteAnnouncementById(id) {
  const sql = `DELETE FROM announcements WHERE id = $1`;
  await pool.query(sql, [id]);
}

export async function getAnnouncementsForManager(filters = {}) {
  let sql = `
        SELECT a.*, u.first_name, u.last_name
        FROM announcements a
        JOIN users u ON a.user_id = u.id
    `;
  const values = [];
  if (filters.status) {
    values.push(filters.status);
    sql += ` WHERE a.status = $1`;
  }
  sql += ` ORDER BY a.publish_at DESC;`;

  const { rows: announcements } = await pool.query(sql, values);
  return announcements;
}

export async function createAnnouncementForReview(announcement, userId) {
  const sql = `
        INSERT INTO announcements(date, announcement, user_id, announcement_type, status)
        VALUES (NOW(), $1, $2, 'General', 'pending')
        RETURNING *;
    `;
  const {
    rows: [newAnnouncement],
  } = await pool.query(sql, [announcement, userId]);
  return newAnnouncement;
}

export async function updateAnnouncementStatus(id, status) {
  const sql = `
        UPDATE announcements SET status = $2 WHERE id = $1 RETURNING *;
    `;
  const {
    rows: [updatedAnnouncement],
  } = await pool.query(sql, [id, status]);
  return updatedAnnouncement;
}
