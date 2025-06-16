import express from "express";
const router = express.Router();
export default router;
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utilities/jwt";
import {
  createUser,
  getUserByUsernameAndPassword,
  getUserByIdSecure,
  updateUserById,
  deleteUser,
  getAllUsers,
} from "#db/queries/users";

// UNPROTECTED ROUTES
router
  .route("/register")
  .post(
    requireBody([
      "username",
      "password",
      "firstName",
      "lastName",
      "email",
      "unit",
    ]),
    async (req, res) => {
      try {
        // spread & copy to always set isManager to false for user role
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

      // --- START OF DEBUGGING LOGS ---
      console.log("\n--- LOGIN ATTEMPT RECEIVED ---");
      console.log("Timestamp:", new Date().toLocaleTimeString());
      console.log("Username from Postman:", username);
      console.log("Password from Postman:", password);
      // --- END OF DEBUGGING ---

      const user = await getUserByUsernameAndPassword(username, password);

      // --- MORE DEBUGGING ---
      if (!user) {
        console.log(
          "Database Result: getUserByUsernameAndPassword returned null."
        );
        console.log(
          "Conclusion: No user found with that username, OR the password was incorrect."
        );
        console.log("--- END OF LOGIN ATTEMPT ---\n");
        return res.status(404).json({ error: "Invalid username or password." });
      }

      console.log("Database Result: User found successfully!");
      console.log("--- END OF LOGIN ATTEMPT ---\n");
      // --- END OF DEBUGGING ---

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
      const user = await getUserByIdSecure(req.params.id, req.user);
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
    requireBody(["email", "unit", "isManager", "isCurrentUser"]),
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
