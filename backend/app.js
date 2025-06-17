import express from "express";
const app = express();

import userRouter from "#api/users";
import announcementsRouter from "#api/announcements";
import unitsRouter from "#api/units";
import propertiesRouter from "#api/properties";
import rentPaymentsRouter from "#api/rent_payments";
import getUserFromToken from "#middleware/getUserFromToken";
import utilitiesRouter from "#api/utility_information";

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", userRouter);
app.use("/announcements", announcementsRouter);
app.use("/units", unitsRouter);
app.use("/properties", propertiesRouter);
app.use("/utilities", utilitiesRouter);
app.use("/rent_payments", rentPaymentsRouter);

app.get("/", (req, res) => {
  res.status(200).send("Property Management Capstone!");
});

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
