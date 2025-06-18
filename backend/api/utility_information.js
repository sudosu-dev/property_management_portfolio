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

router.route("/my").get(async (req, res) => {
  try {
    const utility_information = await getUtility_informationByUserId(
      req.user.id
    );
    res.status(200).json(utility_information);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to load utility information" });
  }
});
