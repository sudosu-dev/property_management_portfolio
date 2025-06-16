/** Requires a logged-in user */
export default async function requireUser(req, res, next) {
  // --- ADD THIS LOG ---
  // What does req.user look like when it gets here?
  console.log(
    `[requireUser]        Checking for user.         User object is:`,
    req.user ? { id: req.user.id, username: req.user.username } : req.user
  );
  // --- END LOG ---

  if (!req.user) return res.status(401).send("Unauthorized");
  next();
}
