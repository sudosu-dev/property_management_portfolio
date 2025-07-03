import styles from "./Payments.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useQuery from "../../api/useQuery";
import { useApi } from "../../api/ApiContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNotifications } from "../../Context/NotificationContext";
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
  const { showError } = useNotifications();
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
      showError("Could not initiate payment. Please try again later.");
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
      <header className={styles.header}>
        <h1>Payments</h1>
        {isProcessingPayment && (
          <div
            className={styles.processingMessage}
            role="status"
            aria-live="polite"
          >
            Processing your payment, please wait...
          </div>
        )}
      </header>

      <main className={styles.sectionLayout}>
        <section
          className={styles.currentBalance}
          aria-labelledby="balance-heading"
        >
          <div>
            <h2 id="balance-heading">Your Current Balance</h2>
            {loading ? (
              <div
                className={styles.loadingSpinner}
                role="status"
                aria-label="Loading balance"
              >
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <p
                className={styles.balanceAmount}
                aria-label={`Current balance: ${formatCurrency(balance)}`}
              >
                {formatCurrency(balance)}
              </p>
            )}
          </div>
          <div>
            <button
              onClick={handleMakePayment}
              disabled={balance <= 0 || showCheckout}
              className={styles.paymentButton}
              aria-describedby={balance <= 0 ? "no-balance-message" : undefined}
            >
              Make Payment
            </button>
            {balance <= 0 && (
              <p id="no-balance-message" className={styles.noBalanceText}>
                No payment needed - your account is current
              </p>
            )}
          </div>
        </section>

        <section
          className={styles.accountLedger}
          aria-labelledby="ledger-heading"
        >
          <h2 id="ledger-heading">Account Ledger</h2>
          <p>Need more help understanding your balance?</p>
          <button
            onClick={() => navigate("/ledger")}
            disabled={showCheckout}
            className={styles.ledgerButton}
          >
            View full account ledger
          </button>
        </section>

        <section
          className={styles.pastPayments}
          aria-labelledby="recent-heading"
        >
          <h2 id="recent-heading">Recent Activity</h2>
          {loading ? (
            <div
              className={styles.loadingSpinner}
              role="status"
              aria-label="Loading recent activity"
            >
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <div className={styles.transactionsContainer}>
              {transactions && transactions.length > 0 ? (
                <ul className={styles.transactionsList} role="list">
                  {transactions.slice(0, 5).map((tx) => (
                    <li key={tx.id} className={styles.transactionItem}>
                      <div className={styles.transactionInfo}>
                        <span
                          className={`${styles.transactionIndicator} ${
                            tx.amount < 0 ? styles.credit : styles.debit
                          }`}
                          aria-hidden="true"
                        >
                          ●
                        </span>
                        <div className={styles.transactionDetails}>
                          <p className={styles.transactionDescription}>
                            {tx.description}
                          </p>
                          <time
                            className={styles.transactionDate}
                            dateTime={tx.created_at}
                          >
                            {new Date(tx.created_at).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                      <span
                        className={`${styles.transactionAmount} ${
                          tx.amount < 0 ? styles.credit : styles.debit
                        }`}
                        aria-label={`${
                          tx.amount < 0 ? "Credit" : "Charge"
                        }: ${formatCurrency(Math.abs(tx.amount))}`}
                      >
                        {formatCurrency(tx.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyState}>No recent activity.</p>
              )}
            </div>
          )}
        </section>
      </main>

      {showCheckout && clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onBack={() => setShowCheckout(false)} />
        </Elements>
      )}
    </div>
  );
}
