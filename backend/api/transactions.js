import express from "express";
import requireUser from "#middleware/requireUser";
import {
  getTransactionsByUserId,
  getAggregatedBalances,
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

export default router;
