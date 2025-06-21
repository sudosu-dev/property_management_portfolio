export default async function requireManager(req, res, next) {
  if (!req.user || !req.user.is_manager) {
    return res
      .status(403)
      .json({ error: "Access denied. Manager privileges required." });
  }

  next();
}
