import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import {
  getAllUnpaidUtility_information,
  getAllUtility_information,
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
      .json({ error: "something went wrong getting utility information" });
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
      .json({ error: "something went wrong updating utility information" });
  }
});
