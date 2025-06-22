import express from "express";
import requireUser from "#middleware/requireUser";
import requireManager from "#middleware/requireManager";
import requireBody from "#middleware/requireBody";

import {
  getTransactionsByUserId,
  getAggregatedBalances,
  createCharge,
} from "#db/queries/transactions";

const router = express.Router();

router.use(requireUser);

router.get("/my-history", async (req, res) => {
  try {
    const history = await getTransactionsByUserId(req.user.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve transaction history." });
  }
});

router.get("/all-balances", requireManager, async (req, res) => {
  try {
    const balance = await getAggregatedBalances();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tenant balances." });
  }
});

router.post(
  "/charge",
  requireManager,
  requireBody(["userId", "unitId", "type", "description", "amount"]),
  async (req, res) => {
    const { userId, unitId, type, description, amount } = req.body;

    try {
      const positiveAmount = Math.abs(parseFloat(amount));
      const newCharge = await createCharge(
        userId,
        unitId,
        type,
        description,
        amount
      );
      res.status(200).json(newCharge);
    } catch (error) {
      console.error("Failed to create manual charge", error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the charge" });
    }
  }
);

router.post(
  "/record-payment",
  requireManager,
  requireBody(["userId", "unitId", "type", "description", "amount"]),
  async (req, res) => {
    const { userId, unitId, type, description, amount } = req.body;

    try {
      // make sure the amount is stored as a negative value for payments
      const negativeAmount = -Math.abs(parseFloat(amount));
      const newPayment = await createCharge(
        userId,
        unitId,
        type,
        description,
        negativeAmount
      );
      res.status(201).json(newPayment);
    } catch (error) {
      console.error("Failed to record offline payment:", error);
      res
        .status(500)
        .json({ error: "An error occurred while recording the payment." });
    }
  }
);

router.get("/user-history/:userId", requireManager, async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await getTransactionsByUserId(userId);
    res.json(history);
  } catch (error) {
    console.error(
      `Failed to retrieve transaction history for user ${userId}:`,
      error
    );
    res.status(500).json({ error: "Failed to retrieve transaction history." });
  }
});

export default router;
