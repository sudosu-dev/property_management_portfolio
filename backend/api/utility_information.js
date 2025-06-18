import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import {
  getAllUnpaidUtility_information,
  getAllUtility_information,
  getUtility_informationByUserId,
} from "#db/queries/utility_information";

router.use(requireUser);

router.route("/").get(async (req, res) => {
  try {
    if (req.user.is_manager != true)
      return res.status(401).json({ message: "Unauthorized" });
    const utility_information = await getAllUtility_information();
    res.status(200).send(utility_information);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Something went wrong getting utility information" });
  }
});

router.route("/unpaid").get(async (req, res) => {
  try {
    if (req.user.is_manager != true)
      return res.status(401).json({ message: "Unauthorized" });
    const utility_information = await getAllUnpaidUtility_information();
    res.status(200).send(utility_information);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Something went wrong updating utility information" });
  }
});

router.get("/:id", async (req, res) => {
  const requestedId = parseInt(req.params.id);

  if (!req.user.is_manager && req.user.id !== requestedId) {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const utilityInfo = await getUtility_informationByUserId(requestedId);
    if (!utilityInfo) {
      return res.status(404).json({ error: "Utility info not found" });
    }
    res.status(200).json(utilityInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load utility information" });
  }
});
