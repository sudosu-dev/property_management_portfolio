import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import styles from "./Payments.module.css";

export default function CheckoutForm({ onBack }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payments`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <div className={styles.checkoutOverlay}>
      <div className={styles.checkoutContent}>
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement id="payment-element" />
          <button
            disabled={isProcessing || !stripe || !elements}
            id="submit"
            className={styles.payButton}
          >
            <span>{isProcessing ? "Processing..." : "Pay now"}</span>
          </button>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          {message && <div id="payment-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}
