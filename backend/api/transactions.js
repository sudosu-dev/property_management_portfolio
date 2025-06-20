import express from "express";
import requireUser from "#middleware/requireUser";
import { getTransactionsByUserId } from "#db/queries/transactions";

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

export default router;
