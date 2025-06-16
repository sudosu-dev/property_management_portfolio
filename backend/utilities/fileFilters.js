export const imageFileFilter = function (req, file, cb) {
  const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalide file type. Only JPG, PNG, and GIF files are allowedl."
      ),
      false
    );
  }
};
