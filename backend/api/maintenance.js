import express from "express";
import multer from "multer";
import path from "path";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createMaintenanceRequest,
  addMaintenancePhoto,
} from "#db/queries/maintenance";

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

const upload = multer({ storage: storage }).array(
  "maintenance_photos",
  MAX_PHOTO_COUNT
);

router.use(requireUser);

router.post(
  "/",
  requireBody(["information"]),
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

      if (req.files && req.files.length > 0) {
        const photoPromises = req.files.map((file) => {
          return addMaintenancePhoto(newRequest.id, file.path);
        });
        await Promise.all(photoPromises);
      }

      res.status(201).json(newRequest);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while creating the maintenance request.",
      });
    }
  }
);

export default router;
