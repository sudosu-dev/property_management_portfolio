import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  getPropertyByName,
  deleteProperty,
} from "#db/queries/properties.js";

import requireUser from "#middleware/require-user.js";
import requireBody from "#middleware/require-body.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const properties = await getProperties();
  res.json(properties);
});

router.get("/id/:id", async (req, res) => {
  const property = await getPropertyById(req.params.id);
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

router.get("/name/:name", async (req, res) => {
  const property = await getPropertyByName(req.params.name);
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

router.post(
  "/",
  requireUser,
  requireBody(["propertyName"]),
  async (req, res) => {
    const property = await createProperty(req.body);
    res.status(201).json(property);
  }
);

router.delete("/:id", requireUser, async (req, res) => {
  const deleted = await deleteProperty(req.params.id);
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

export default router;
