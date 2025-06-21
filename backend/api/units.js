import express from "express";
import {
  createUnit,
  getUnits,
  getUnitsByPropertyId,
  getUnitsByPropertyIdAndUnitNumber,
  getUnitByPropertyIdAndTenantName,
  updateUnit,
  deleteUnit,
} from "#db/queries/units";

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router.use(requireUser);

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

router.get("/", async (req, res) => {
  try {
    if (req.user.is_manager) {
      const units = await getUnits();
      return res.json(units);
    }

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

router.get("/property/:propertyId/unit/:unitNumber", async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res
        .status(403)
        .json({ error: "Only managers can access this route." });
    }

    const unit = await getUnitsByPropertyIdAndUnitNumber(
      req.params.propertyId,
      req.params.unitNumber
    );

    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.patch("/:id", requireUser, async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res.status(403).json({ error: "Only managers can update units." });
    }

    const updated = await updateUnit(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
