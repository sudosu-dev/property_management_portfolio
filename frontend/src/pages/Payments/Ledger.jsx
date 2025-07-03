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

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState} role="alert">
          <h1>Error Loading Ledger</h1>
          <p>Unable to load your account history: {error}</p>
          <button
            onClick={() => navigate("/payments")}
            className={styles.backButton}
          >
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Account Ledger</h1>
        <p className={styles.description}>Showing all account transactions</p>
      </header>

      <main>
        {loading ? (
          <div
            className={styles.loadingContainer}
            role="status"
            aria-label="Loading account ledger"
          >
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
            </div>
            <p>Loading ledger...</p>
          </div>
        ) : (
          <>
            <div className={styles.desktopView}>
              <div className={styles.tableContainer}>
                <table
                  className={styles.table}
                  role="table"
                  aria-label="Account transaction history"
                >
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Type</th>
                      <th scope="col">Description</th>
                      <th scope="col" style={{ textAlign: "right" }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions && transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            <time dateTime={tx.created_at}>
                              {new Date(tx.created_at).toLocaleDateString()}
                            </time>
                          </td>
                          <td>{tx.type}</td>
                          <td>{tx.description}</td>
                          <td
                            style={{ textAlign: "right" }}
                            className={
                              tx.amount < 0 ? styles.credit : styles.debit
                            }
                            aria-label={`${
                              tx.amount < 0 ? "Credit" : "Charge"
                            }: ${formatCurrency(Math.abs(tx.amount))}`}
                          >
                            {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className={styles.emptyState}>
                          No ledger entries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.mobileView}>
              {transactions && transactions.length > 0 ? (
                <div className={styles.transactionCards}>
                  <ul className={styles.cardsList} role="list">
                    {transactions.map((tx) => (
                      <li key={tx.id} className={styles.transactionCard}>
                        <div className={styles.cardHeader}>
                          <time
                            className={styles.cardDate}
                            dateTime={tx.created_at}
                          >
                            {new Date(tx.created_at).toLocaleDateString()}
                          </time>
                          <div className={styles.cardType}>{tx.type}</div>
                        </div>
                        <div className={styles.cardDescription}>
                          {tx.description}
                        </div>
                        <div
                          className={`${styles.cardAmount} ${
                            tx.amount < 0
                              ? styles.cardAmountCredit
                              : styles.cardAmountDebit
                          }`}
                          aria-label={`${
                            tx.amount < 0 ? "Credit" : "Charge"
                          }: ${formatCurrency(Math.abs(tx.amount))}`}
                        >
                          {formatCurrency(tx.amount)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className={styles.noTransactions}>
                  <p>No ledger entries found.</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/payments")}
            aria-label="Return to payments page"
          >
            Back to Payments
          </button>
        </div>
      </main>
    </div>
  );
}
