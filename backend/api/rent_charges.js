import express from "express";
import { getRentChargesByUserId } from "#db/queries/rent_charges";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

router.use(requireUser);

// GET /rent_charges/my
router.get("/:id", async (req, res) => {
  try {
    const charges = await getRentChargesByUserId(req.user.id);
    res.status(200).json(charges);
  } catch (err) {
    console.error("Failed to fetch rent charges", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
