// frontend/src/pages/Payments/Ledger.jsx

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
      <div className={styles.tableContainer}>
        <p>Showing all account transactions</p>
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
        <button onClick={() => navigate("/payments")}>Back to Payments</button>
      </div>
    </div>
  );
}
