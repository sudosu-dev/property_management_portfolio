import express from "express";
const router = express.Router();
export default router;

import {
  createAnnouncements,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById,
} from "#db/queries/announcements";

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

router
  .route("/")
  .get(async (req, res) => {
    const announcements = await getAnnouncements();
    res.send(announcements);
  })
  .post(
    requireBody(["date", "announcement", "announcement_type"]),
    async (req, res) => {
      if (!req.user.is_manager) {
        return res
          .status(403)
          .send("Sorry, only managers can make announcements.");
      }
      const { date, announcement, announcement_type } = req.body;
      const user_id = req.user.id;
      const newAnnouncement = await createAnnouncements(
        date,
        announcement,
        user_id,
        announcement_type
      );
      res.status(201).send(newAnnouncement);
    }
  );

router.param("id", async (req, res, next, id) => {
  const announcement = await getAnnouncementById(id);
  if (!announcement) return res.status(404).send("Announcement not found.");
  req.announcement = announcement;
  next();
});

router
  .route("/:id")
  .get(async (req, res) => {
    res.send(req.announcement);
  })
  .put(
    requireBody(["date", "announcement", "announcement_type"]),
    async (req, res) => {
      if (!req.user.is_manager) {
        return res.status(403).send("Only managers can update announcements!");
      }
      if (req.announcement.user_id !== req.user.id) {
        return res
          .status(403)
          .send("Unauthorized to update this announcement!");
      }
      const { date, announcement, announcement_type } = req.body;
      const user_id = req.user.id;
      const updateAnnouncement = await updateAnnouncementById(
        req.announcement.id,
        date,
        announcement,
        user_id,
        announcement_type
      );
      res.send(updateAnnouncement);
    }
  )
  .delete(async (req, res) => {
    if (!req.user.is_manager) {
      return res.status(403).send("Only managers can delete announcements!");
    }
    if (req.announcement.user_id !== req.user.id) {
      return res.status(403).send("Unauthorized to delete this announcement!");
    }
    await deleteAnnouncementById(req.announcement.id);
    res.sendStatus(204);
  });
