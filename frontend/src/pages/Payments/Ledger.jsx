import styles from "./Ledger.module.css";
import { useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";

export default function Ledger() {
  const navigate = useNavigate();
  const {
    data: transactions,
    loading,
    error,
  } = useQuery("/transactions/my-history", "transactions");

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  if (loading) return <p>Loading ledger...</p>;
  if (error) return <p>Error loading ledger: {error}</p>;

  return (
    <div className={styles.page}>
      <h1>Account Ledger</h1>
      <p className={styles.description}>Showing all account transactions</p>

      {/* Desktop Table */}
      <div className={styles.desktopView}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td>{tx.type}</td>
                  <td>{tx.description}</td>
                  <td
                    style={{
                      textAlign: "right",
                      color: tx.amount < 0 ? "green" : "inherit",
                    }}
                  >
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No ledger entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileView}>
        {transactions && transactions.length > 0 ? (
          <div className={styles.transactionCards}>
            {transactions.map((tx) => (
              <div key={tx.id} className={styles.transactionCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardDate}>
                    {new Date(tx.created_at).toLocaleDateString()}
                  </div>
                  <div className={styles.cardType}>{tx.type}</div>
                </div>
                <div className={styles.cardDescription}>{tx.description}</div>
                <div
                  className={`${styles.cardAmount} ${
                    tx.amount < 0
                      ? styles.cardAmountCredit
                      : styles.cardAmountDebit
                  }`}
                >
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noTransactions}>
            <p>No ledger entries found.</p>
          </div>
        )}
      </div>

      <button
        className={styles.backButton}
        onClick={() => navigate("/payments")}
      >
        Back to Payments
      </button>
    </div>
  );
}
