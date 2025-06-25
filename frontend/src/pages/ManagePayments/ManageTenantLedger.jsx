import { useParams, useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";
import styles from "./ManageTenantLedger.module.css";

export default function ManageTenantLedger() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: transactions, loading: loadingHistory } = useQuery(
    `/transactions/user-history/${userId}`,
    `ledger-${userId}`
  );
  const { data: tenant, loading: loadingTenant } = useQuery(
    `/users/${userId}`,
    `user-${userId}`
  );

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

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          {isLoading ? (
            <h1>Loading Ledger...</h1>
          ) : (
            <>
              <h1>
                Account Ledger for {tenant?.first_name} {tenant?.last_name}
              </h1>
              <p>
                Unit {tenant?.unit?.unit_number} | User ID: {userId}
              </p>
            </>
          )}
        </header>

        <section className={styles.section}>
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
              {isLoading ? (
                <tr>
                  <td colSpan="4">Loading transactions...</td>
                </tr>
              ) : transactions && transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td>{tx.type}</td>
                    <td>{tx.description}</td>
                    <td
                      style={{ textAlign: "right" }}
                      className={getAmountStyle(tx.amount)}
                    >
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No transactions found for this user.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Back to All Balances
        </button>
      </div>
    </div>
  );
}
