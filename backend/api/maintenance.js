import express from "express";
import multer from "multer";
import path from "path";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createMaintenanceRequest,
  addMaintenancePhoto,
  getMaintenanceRequests,
  getMaintenanceRequestById,
  updateMaintenanceRequestById,
  updateMaintenanceRequestCompletion,
} from "#db/queries/maintenance";
import { imageFileFilter } from "#utilities/fileFilters";

const router = express.Router();

const MAX_PHOTO_COUNT = 5;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFileFilter,
}).array("maintenance_photos", MAX_PHOTO_COUNT);

router.use(requireUser);

router.post(
  "/",
  (req, res, next) => {
    upload(req, res, function (error) {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          error: `File upload error: ${error.message} Max ${MAX_PHOTO_COUNT} photos allowed.`,
        });
      } else if (error) {
        return res
          .status(500)
          .json({ error: "An unknown error occured during file upload." });
      }
      next();
    });
  },
  requireBody(["information"]),
  async (req, res) => {
    try {
      let unitId;
      const { information } = req.body;
      const user = req.user;

      if (user.is_manager) {
        unitId = req.body.unitId;
        if (!unitId) {
          return res
            .status(400)
            .json({ error: "Bad Request: Managers must provide a unit ID" });
        }
      } else {
        unitId = user.unit;
      }

      const newRequest = await createMaintenanceRequest({
        information,
        userId: user.id,
        unitId: unitId,
      });

      // check if any files were uploaded and if so then loop over them with map
      // ** wait until all files are uploaded before moving on **
      if (req.files && req.files.length > 0) {
        const photoPromises = req.files.map((file) => {
          return addMaintenancePhoto(newRequest.id, file.path);
        });
        await Promise.all(photoPromises);
      }

      const completedNewRequest = await getMaintenanceRequestById(
        newRequest.id
      );

      res.status(201).json(completedNewRequest);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while creating the maintenance request.",
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    // We pass the logged-in user and any query parameters (e.g., /maintenance?completed=false)
    // directly to our database function. It will handle all the logic.
    const requests = await getMaintenanceRequests(req.user, req.query);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching maintenance requests.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await getMaintenanceRequestById(id);

    // First, check if a request with that ID even exists.
    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found." });
    }

    // Next, check for permission.
    // Allow access if the user is a manager OR if the request's user_id matches the logged-in user's id.
    if (!req.user.is_manager && request.user_id !== req.user.id) {
      // To avoid revealing that the request exists, we send a 404 Not Found instead of a 403 Forbidden.
      return res.status(404).json({ error: "Maintenance request not found." });
    }

    // If all checks pass, send the request.
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching the maintenance request.",
    });
  }
});

/**
 * @route   PUT /maintenance/:id
 * @desc    Update the information text of a maintenance request
 * @access  Private (Owner or Manager only)
 */
router.put("/:id", requireBody(["information"]), async (req, res) => {
  try {
    const { id } = req.params;
    const request = await getMaintenanceRequestById(id);

    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found." });
    }

    if (!req.user.is_manager && request.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only update your own requests." });
    }

    const updatedRequest = await updateMaintenanceRequestById(
      id,
      req.body,
      req.user
    );
    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while updating the maintenance request.",
    });
  }
});

/**
 * @route   PUT /maintenance/:id/completion
 * @desc    Update the completion status of a maintenance request
 * @access  Private (Manager only)
 */
router.put("/:id/completion", requireBody(["completed"]), async (req, res) => {
  try {
    if (!req.user.is_manager) {
      return res
        .status(403)
        .json({ error: "Forbidden: Only managers can update request status." });
    }

    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "Bad Request: 'completed' field must be a boolean." });
    }
    const updatedRequest = await updateMaintenanceRequestCompletion(id, {
      completed,
    });

    if (!updatedRequest) {
      return res.status(404).json({ error: "Maintenance request not found." });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while updating the maintenance request.",
    });
  }
});

export default router;
