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
import {
  createUtility_information,
  getUtility_informationByUserIdAndPaidStatus,
  updateUtility_informationPaidStatusByUserId,
} from "#db/queries/utility_information";

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
      console.log(username);
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

router.get("/me", requireUser, async (req, res) => {
  try {
    const user = await getUserByIdSecure(req.user.id, req.user);
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve user data" });
  }
});

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
  .put(requireUser, async (req, res) => {
    try {
      const user = await updateUserById(req.params.id, req.body, req.user);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      res.json(user);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  })
  .delete(requireUser, async (req, res) => {
    try {
      await deleteUser(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  });

router.use(requireUser);

router
  .route("/:id/utilities")
  .get(async (req, res) => {
    try {
      const utility_information =
        await getUtility_informationByUserIdAndPaidStatus(req.params.id);
      res.status(200).send(utility_information);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Something went wrong getting utility information" });
    }
  })
  .post(requireBody([]), async (req, res) => {
    try {
      req.body.user_id = req.params.id;
      const utility_information = await createUtility_information(req.body);
      res.status(201).send(utility_information);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Something went wrong creating utility information" });
    }
  })
  .patch(requireBody(["paid"]), async (req, res) => {
    try {
      const utility_information =
        await updateUtility_informationPaidStatusByUserId(
          req.body.paid,
          req.params.id
        );
      res.status(200).send(utility_information);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Something went wrong updating utility information" });
    }
  });
