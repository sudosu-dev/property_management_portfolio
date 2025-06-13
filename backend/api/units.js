import express from "express";
import {
  createUnit,
  getUnits,
  getUnitsByPropertyId,
  getUnitsByPropertyIdAndUnitNumber,
  getUnitByPropertyIdAndTenantName,
  deleteUnit,
} from "#db/queries/units.js";

import requireUser from "#middleware/require-user.js";
import requireBody from "#middleware/require-body.js";

const router = express.Router();

// Require authentication for all routes
router.use(requireUser);

// GET /units - managers see all, residents see their own
router.get("/", async (req, res) => {
  try {
    if (req.user.is_manager) {
      const units = await getUnits();
      return res.json(units);
    }

    // Resident: only return the unit they belong to
    const userUnit = await getUnitsByPropertyIdAndUnitNumber(
      req.user.unit.property_id,
      req.user.unit.unit_number
    );

    if (!userUnit) {
      return res.status(404).json({ error: "Your unit was not found." });
    }

    res.json(userUnit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /units/property/:propertyId
router.get("/property/:propertyId", async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res
        .status(403)
        .json({ error: "Only managers can view property-wide units." });
    }

    const units = await getUnitsByPropertyId(req.params.propertyId);
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /units/property/:propertyId/unit/:unitNumber
router.get("/property/:propertyId/unit/:unitNumber", async (req, res) => {
  try {
    const unit = await getUnitsByPropertyIdAndUnitNumber(
      req.params.propertyId,
      req.params.unitNumber
    );

    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    // If not manager, verify user belongs to this unit
    if (
      !req.user.is_manager &&
      (req.user.unit.property_id !== unit.property_id ||
        req.user.unit.unit_number !== unit.unit_number)
    ) {
      return res.status(403).json({ error: "Access denied to this unit." });
    }

    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /units/property/:propertyId/tenant/:tenantName
router.get("/property/:propertyId/tenant/:tenantName", async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res.status(403).json({
        error: "Only managers can look up units by tenant name.",
      });
    }

    const unit = await getUnitByPropertyIdAndTenantName(
      req.params.propertyId,
      req.params.tenantName
    );

    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /units - managers only
router.post(
  "/",
  requireBody(["propertyId", "unitNumber", "tenantName"]),
  async (req, res) => {
    try {
      if (!req.user.is_manager) {
        return res
          .status(403)
          .json({ error: "Only managers can create units." });
      }

      const unit = await createUnit(req.body);
      res.status(201).json(unit);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE /units/:id - managers only
router.delete("/:id", async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res.status(403).json({ error: "Only managers can delete units." });
    }

    const deleted = await deleteUnit(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
