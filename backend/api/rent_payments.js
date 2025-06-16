import express from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

import {
  getAllRentPayments,
  getRentPaymentsByUserId,
  createRentPayment,
  updateRentPaymentById,
  deleteRentPayment,
} from "#db/queries/rent_payments";

const router = express.Router();

router.use(requireUser); // enforce user authentication on all routes

// Managers only: get all rent payments
router.get("/", async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res.status(403).json({ error: "Access denied - managers only." });
    }
    const rentPayments = await getAllRentPayments();
    res.json(rentPayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rent payments by user id (user themselves or manager)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (!req.user.is_manager && req.user.id !== userId) {
      return res
        .status(403)
        .json({ error: "Access denied - can only view your own payments." });
    }

    const rentPayments = await getRentPaymentsByUserId(userId);
    res.json(rentPayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create rent payment (managers only)
router.post(
  "/",
  requireBody(["due_date", "payment_amount", "user_id", "unit"]),
  async (req, res) => {
    try {
      if (!req.user.is_manager) {
        return res
          .status(403)
          .json({ error: "Access denied - managers only." });
      }

      const rentPayment = await createRentPayment(req.body);
      res.status(201).json(rentPayment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update rent payment by id (managers only)
router.put("/:id", async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res.status(403).json({ error: "Access denied - managers only." });
    }

    const rentPayment = await updateRentPaymentById(
      parseInt(req.params.id),
      req.body
    );

    if (!rentPayment) {
      return res.status(404).json({ error: "Rent payment not found." });
    }

    res.json(rentPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete rent payment by id (managers only)
router.delete("/:id", async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res.status(403).json({ error: "Access denied - managers only." });
    }

    const deleted = await deleteRentPayment(parseInt(req.params.id));

    if (!deleted) {
      return res.status(404).json({ error: "Rent payment not found." });
    }

    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
