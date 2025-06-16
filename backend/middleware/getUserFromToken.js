import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utilities/jwt";

/** Attaches the user to the request if a valid token is provided */
export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);

    // --- ADD THIS LOG ---
    // We are logging the user we found (or didn't find).
    // We log just the id/username to keep the console clean.
    console.log(
      `[getUserFromToken] Attempted to find user by token. User object is:`,
      user ? { id: user.id, username: user.username } : user
    );
    // --- END LOG ---

    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Invalid token.");
  }
}

//=== TO DO === make getUserByID function
