import express from "express";
import requireUser from "#middleware/requireUser";
import requireManager from "#middleware/requireManager";
import { getSettings, updateSettings } from "#db/queries/settings";

const router = express.Router();

router.use(requireUser);
router.use(requireManager);

router.get("/", async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

router.put("/", async (req, res) => {
  try {
    await updateSettings(req.body);
    res.json({ message: "Settings updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings." });
  }
});

export default router;
