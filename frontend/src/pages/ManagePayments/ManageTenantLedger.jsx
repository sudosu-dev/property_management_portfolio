import { useParams, useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";
import styles from "./ManageTenantLedger.module.css";

export default function ManageTenantLedger() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    data: transactions,
    loading: loadingHistory,
    error: errorHistory,
  } = useQuery(`/transactions/user-history/${userId}`, `ledger-${userId}`);
  const {
    data: tenant,
    loading: loadingTenant,
    error: errorTenant,
  } = useQuery(`/users/${userId}`, `user-${userId}`);

  function formatCurrency(amount) {
    return parseFloat(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function getAmountStyle(amount) {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0) return styles.amountDebit;
    if (numericAmount < 0) return styles.amountCredit;
    return "";
  }

  const isLoading = loadingHistory || loadingTenant;
  const error = errorHistory || errorTenant;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Error Loading Ledger</h1>
          <p>Unable to load account ledger: {error}</p>
          <button
            onClick={() => navigate("/admin/payments")}
            className={styles.backButton}
            aria-label="Return to payments management page"
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
        {isLoading ? (
          <>
            <h1>Loading Ledger...</h1>
            <div
              className={styles.loadingContainer}
              role="status"
              aria-label="Loading account ledger"
            >
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>
              Account Ledger for {tenant?.first_name} {tenant?.last_name}
            </h1>
            <p className={styles.description}>
              Unit {tenant?.unit?.unit_number} | User ID: {userId}
            </p>
          </>
        )}
      </header>

      <main className={styles.content}>
        {!isLoading && (
          <>
            {/* Desktop Table View */}
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
                            className={getAmountStyle(tx.amount)}
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
                          No transactions found for this user.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
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
                  <p>No transactions found for this user.</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/payments")}
            aria-label="Return to payments management page"
          >
            Back to Payments
          </button>
        </div>
      </main>
    </div>
  );
}
