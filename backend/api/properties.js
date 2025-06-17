import express from "express";
const router = express.Router();

import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} from "#db/queries/properties";

import requireUser from "#middleware/requireUser";

router.use(requireUser);

router.post("/", async (req, res) => {
  if (!req.user.is_manager) {
    return res
      .status(403)
      .json({ error: "Only managers can create properties" });
  }

  const property = await createProperty(req.body);
  res.status(201).json(property);
});

router.get("/", async (req, res) => {
  const properties = await getProperties();
  res.json(properties);
});

router.get("/:id", async (req, res) => {
  const property = await getPropertyById(req.params.id);
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

router.patch("/:id", requireUser, async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res
        .status(403)
        .json({ error: "Only managers can update properties." });
    }

    const updated = await updateProperty(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.user.is_manager) {
    return res
      .status(403)
      .json({ error: "Only managers can delete properties" });
  }

  const deleted = await deleteProperty(req.params.id);
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

export default router;
