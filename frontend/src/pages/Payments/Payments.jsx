// frontend/src/pages/Payments/Payments.jsx

import styles from "./Payments.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useQuery from "../../api/useQuery";
import { useApi } from "../../api/ApiContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Payments() {
  const navigate = useNavigate();
  const { request } = useApi();
  const {
    data: transactions,
    loading,
    query: refetchTransactions,
  } = useQuery("/transactions/my-history", "transactions");

  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentSecret = urlParams.get("payment_intent_client_secret");
    if (paymentIntentSecret) {
      setIsProcessingPayment(true);
      const timer = setTimeout(() => {
        refetchTransactions();
        setIsProcessingPayment(false);
        navigate("/payments", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const balance = transactions
    ? transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    : 0;

  const handleMakePayment = async () => {
    try {
      const { clientSecret: secret } = await request(
        "/stripe_payments/create-payment",
        { method: "POST" }
      );
      setClientSecret(secret);
      setShowCheckout(true);
    } catch (error) {
      alert("Could not initiate payment. Please try again later.");
    }
  };

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className={styles.page}>
      <h1>Payments</h1>
      {isProcessingPayment && (
        <div className={styles.processingMessage}>
          Processing your payment, please wait...
        </div>
      )}
      <div className={styles.sectionLayout}>
        <section className={styles.currentBalance}>
          <div>
            <h2>Your Current Balance</h2>
            {loading ? <p>Calculating...</p> : <p>{formatCurrency(balance)}</p>}
          </div>
          <div>
            <button
              onClick={handleMakePayment}
              disabled={balance <= 0 || showCheckout}
            >
              Make Payment
            </button>
          </div>
        </section>
        <section className={styles.accountLedger}>
          <h2>Account Ledger</h2>
          <p>Need more help understanding your balance?</p>
          <button onClick={() => navigate("/ledger")} disabled={showCheckout}>
            View full account ledger
          </button>
        </section>
        <section className={styles.pastPayments}>
          <p>Recent Activity</p>
          <table className={styles.paymentsTable}>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id}>
                    <div>
                      <td style={{ color: tx.amount < 0 ? "green" : "red" }}>
                        ●
                      </td>
                      <td>
                        <p>{tx.description}</p>
                        <p style={{ fontSize: "0.8em", color: "#666" }}>
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </td>
                    </div>
                    <td>{formatCurrency(tx.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No recent activity.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
      {showCheckout && clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onBack={() => setShowCheckout(false)} />
        </Elements>
      )}
    </div>
  );
}
