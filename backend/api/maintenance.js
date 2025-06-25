import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createMaintenanceRequest,
  addMaintenancePhoto,
  getMaintenanceRequests,
  getMaintenanceRequestById,
  updateMaintenanceRequestById,
  updateMaintenanceRequestCompletion,
  deleteUnkeptPhotos,
  deleteMaintenanceRequestById,
} from "#db/queries/maintenance";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "property-management-capstone",
    allowed_formats: ["jpeg", "png", "jpg", "gif"],
  },
});

const MAX_PHOTO_COUNT = 5;

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("maintenance_photos", MAX_PHOTO_COUNT);

router.use(requireUser);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const requests = await getMaintenanceRequests(req.user, req.query);
      res.json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while fetching maintenance requests.",
      });
    }
  })
  .post(
    (req, res, next) => {
      upload(req, res, function (error) {
        if (error) {
          return res
            .status(400)
            .json({ error: `File upload error: ${error.message}` });
        }
        next();
      });
    },
    requireBody(["information"]),
    async (req, res) => {
      try {
        let unit_number;
        const { information } = req.body;
        const user = req.user;

        if (user.is_manager) {
          unit_number = req.body.unit_number;
          if (!unit_number) {
            return res
              .status(400)
              .json({ error: "Bad Request: Managers must provide a unit ID" });
          }
        } else {
          unit_number = user.unit;
        }

        const newRequest = await createMaintenanceRequest({
          information,
          userId: user.id,
          unit_number,
        });

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

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const request = await getMaintenanceRequestById(id);
      if (!request) {
        return res
          .status(404)
          .json({ error: "Maintenance request not found." });
      }
      if (!req.user.is_manager && request.user_id !== req.user.id) {
        return res
          .status(404)
          .json({ error: "Maintenance request not found." });
      }
      res.json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while fetching the maintenance request.",
      });
    }
  })
  .put(
    (req, res, next) => {
      upload(req, res, function (error) {
        if (error) {
          return res.status(400).json({ error: error.message });
        }
        next();
      });
    },
    async (req, res) => {
      try {
        const { id } = req.params;
        const request = await getMaintenanceRequestById(id);
        if (!request) {
          return res
            .status(404)
            .json({ error: "Maintenance request not found." });
        }
        if (!req.user.is_manager && request.user_id !== req.user.id) {
          return res.status(403).json({
            error: "Forbidden: You can only update your own requests.",
          });
        }

        const { information, keep_photos } = req.body;
        if (!information) {
          return res.status(400).json({ error: "Missing 'information' field" });
        }
        await updateMaintenanceRequestById(id, { information }, req.user);

        if (keep_photos) {
          const keepPhotoIds = JSON.parse(keep_photos);
          await deleteUnkeptPhotos(id, keepPhotoIds);
        }

        if (req.files && req.files.length > 0) {
          const photoPromises = req.files.map((file) =>
            addMaintenancePhoto(id, file.path)
          );
          await Promise.all(photoPromises);
        }

        const updatedRequest = await getMaintenanceRequestById(id);
        res.json(updatedRequest);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "An error occurred while updating the maintenance request.",
        });
      }
    }
  )
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteMaintenanceRequestById(id, req.user);
      if (!deleted) {
        return res
          .status(404)
          .json({ error: "Maintenance request not found." });
      }
      res.json({ message: "Maintenance request deleted successfully." });
    } catch (error) {
      console.error(error);
      if (error.message === "Unauthorized or request not found.") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({
        error: "An error occurred while deleting the maintenance request.",
      });
    }
  });

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
