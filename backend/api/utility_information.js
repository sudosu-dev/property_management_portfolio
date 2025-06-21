import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import {
  getAllUnpaidUtility_information,
  getAllUtility_information,
  getUtility_informationByUserId,
  createBatchUtilityBills,
} from "#db/queries/utility_information";
import { postUnbilledUtilitiesToLedger } from "#db/queries/transactions";

router.use(requireUser);

router.post("/", async (req, res) => {
  if (!req.user.is_manager) {
    return res
      .status(403)
      .json({ error: "Only managers can create utility bills." });
  }

  const bills = req.body;
  if (!Array.isArray(bills) || bills.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body must be a non-empty array of bills." });
  }

  try {
    const createdBills = await createBatchUtilityBills(bills);
    await postUnbilledUtilitiesToLedger();
    res.status(201).json({
      message: `${createdBills.length} utility bills created and posted to tenant ledgers successfully.`,
      data: createdBills,
    });
  } catch (error) {
    console.error("Failed to create batch utility bills:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating utility bills." });
  }
});

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
