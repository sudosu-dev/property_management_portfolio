import express from "express";
const router = express.Router();
export default router;
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utilities/jwt";
import {
  createUser,
  getUserByUsernameAndPassword,
  getUserById,
  updateUserById,
  deleteUser,
  getAllUsers,
} from "#db/queries/users";

// UNPROTECTED ROUTES
router
  .route("/register")
  .post(
    requireBody(["username", "password", "email", "unit"]),
    async (req, res) => {
      try {
        // spread /set to always set isManager to false for user registration
        const userData = { ...req.body, isManager: false };
        const user = await createUser(userData);
        const token = createToken({ id: user.id });
        res.status(201).json({ user, token });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByUsernameAndPassword(username, password);
      if (!user) {
        return res.status(404).json({ error: "Invalid username or password." });
      }
      const token = createToken({ id: user.id });
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// PROTECTED ROUTES (requireUser middleware)
router
  .route("/")
  .get(requireUser, async (req, res) => {
    try {
      const users = await getAllUsers(req.user);
      res.json(users);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  })
  .post(
    requireUser,
    requireBody(["username", "password", "email", "unit", "isManager"]),
    async (req, res) => {
      try {
        const user = await createUser(req.body);
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

router
  .route("/:id")
  .get(requireUser, async (req, res) => {
    try {
      const user = await getUserById(req.params.id, req.user);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.json(user);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  })
  .put(
    requireUser,
    requireBody(["email", "phone", "unit", "isManager", "isCurrentUser"]),
    async (req, res) => {
      try {
        const user = await updateUserById(req.params.id, req.body, req.user);
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
      } catch (error) {
        res.status(403).json({ error: error.message });
      }
    }
  )
  .delete(requireUser, async (req, res) => {
    try {
      await deleteUser(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  });
