// backend/app.js

import express from "express";
import path from "path";
const app = express();

import userRouter from "#api/users";
import propertiesRouter from "#api/properties";
import unitsRouter from "#api/units";
import rentPaymentsRouter from "#api/rent_payments";
import rentChargesRouter from "#api/rent_charges";
import utilitiesRouter from "#api/utility_information";
import announcementsRouter from "#api/announcements";
import maintenanceRouter from "#api/maintenance";
import stripePaymentRouter from "#api/stripe_payments";
import transactionsRouter from "#api/transactions";
import settingsRouter from "#api/settings";

import getUserFromToken from "#middleware/getUserFromToken";
import limiter from "#middleware/rateLimiter";

import cors from "cors";

app.use(cors());

// The Stripe router is mounted BEFORE express.json() to allow the webhook
// to receive the raw request body for signature verification.
app.use("/stripe_payments", stripePaymentRouter);

app.use(express.json());
app.use(limiter);
app.use(getUserFromToken);
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/users", userRouter);
app.use("/properties", propertiesRouter);
app.use("/units", unitsRouter);
app.use("/rent_payments", rentPaymentsRouter);
app.use("/rent_charges", rentChargesRouter);
app.use("/utilities", utilitiesRouter);
app.use("/announcements", announcementsRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/transactions", transactionsRouter);
app.use("/settings", settingsRouter);

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
