// backend/api/stripe_payments.js

import express from "express";
import Stripe from "stripe";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { getUserBalance, recordStripePayment } from "#db/queries/transactions";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      await recordStripePayment(paymentIntent);
    }

    res.json({ received: true });
  }
);

router.use(getUserFromToken);
router.use(requireUser);

router.post("/create-payment", async (req, res) => {
  try {
    const balance = await getUserBalance(req.user.id);
    //DEBUGGING
    console.log(
      "Creating payment intent for user:",
      req.user.id,
      "with a calculated balance of:",
      balance
    );

    if (balance > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(balance * 100),
        currency: "usd",
        metadata: {
          userId: req.user.id.toString(),
          unitId: req.user.unit.toString(),
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret, amount: balance });
    } else {
      res.status(400).json({ error: "No balance due." });
    }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

export default router;
