import express from "express";
const app = express();

import userRouter from "#api/users";
import announcementsRouter from "#api/announcements";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(express.json());
app.use(getUserFromToken);

app.use("/", (req, res) => {
  res.status(200).send("Property Management Capstone!");
});

app.use("/users", userRouter);
app.use("/announcements", announcementsRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
