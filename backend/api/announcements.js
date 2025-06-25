import express from "express";
const router = express.Router();

import {
  getAnnouncements,
  getAnnouncementsForManager,
  getAnnouncementById,
  createAnnouncements,
  createAnnouncementForReview,
  updateAnnouncementById,
  updateAnnouncementStatus,
  deleteAnnouncementById,
} from "#db/queries/announcements";

import requireUser from "#middleware/requireUser";
import requireManager from "#middleware/requireManager";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

router.get("/", async (req, res) => {
  const announcements = req.user.is_manager
    ? await getAnnouncementsForManager(req.query) // Pass query for filtering
    : await getAnnouncements();
  res.send(announcements);
});

router.post("/submit", requireBody(["announcement"]), async (req, res) => {
  const { announcement } = req.body;
  const newPost = await createAnnouncementForReview(announcement, req.user.id);
  res.status(201).send(newPost);
});

router.post(
  "/",
  requireManager,
  requireBody(["announcement", "announcement_type"]),
  async (req, res) => {
    const { announcement, announcement_type, publish_at } = req.body;
    const displayDate = publish_at ? new Date(publish_at) : new Date();

    const newAnnouncement = await createAnnouncements(
      displayDate,
      announcement,
      req.user.id,
      announcement_type
    );
    res.status(201).send(newAnnouncement);
  }
);

router.param("id", async (req, res, next, id) => {
  const announcement = await getAnnouncementById(id);
  if (!announcement) {
    return res.status(404).send("Announcement not found.");
  }
  req.announcement = announcement;
  next();
});

router.patch(
  "/:id/status",
  requireManager,
  requireBody(["status"]),
  async (req, res) => {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).send("Invalid status.");
    }
    const updatedAnnouncement = await updateAnnouncementStatus(
      req.announcement.id,
      status
    );
    res.send(updatedAnnouncement);
  }
);

router
  .route("/:id")
  .get(async (req, res) => {
    const isOwner = req.announcement.user_id === req.user.id;
    const isApproved = req.announcement.status === "approved";

    if (req.user.is_manager || isOwner || isApproved) {
      return res.send(req.announcement);
    }
    res.status(404).send("Announcement not found.");
  })
  .put(
    requireManager,
    requireBody(["announcement", "announcement_type"]),
    async (req, res) => {
      const { announcement, announcement_type, publish_at } = req.body;
      const displayDate = publish_at
        ? new Date(publish_at)
        : new Date(req.announcement.date);

      const updates = {
        announcement,
        announcement_type,
        publish_at: publish_at || req.announcement.publish_at,
        date: displayDate,
      };

      const updatedAnnouncement = await updateAnnouncementById(
        req.announcement.id,
        updates
      );
      res.send(updatedAnnouncement);
    }
  )
  .delete(requireManager, async (req, res) => {
    await deleteAnnouncementById(req.announcement.id);
    res.sendStatus(204);
  });

export default router;
