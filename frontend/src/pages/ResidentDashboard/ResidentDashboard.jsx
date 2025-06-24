import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import useQuery from "../../api/useQuery";
import styles from "./ResidentDashboard.module.css";

export default function ResidentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: transactions } = useQuery(
    "/transactions/my-history",
    "transactions"
  );
  const { data: announcements } = useQuery("/announcements", "announcements");
  const { data: maintenanceRequests } = useQuery("/maintenance", "maintenance");

  const balance = transactions
    ? transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    : 0;

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function getAccountStatus() {
    if (!transactions) return "Loading...";
    return balance <= 0
      ? "Paid in Full"
      : `Balance Due: ${formatCurrency(balance)}`;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome back, {user?.first_name || "User"}!</h1>
        <p>Account status: {getAccountStatus()}</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.accountBalance}>
          <h2>Account Balance</h2>
          <div className={styles.cardContent}>
            <p className={styles.balanceAmount}>{formatCurrency(balance)}</p>
            <p className={styles.balanceSubtext}>
              This is your current outstanding balance.
            </p>
          </div>
          <Link to="/payments" className={styles.primaryButton}>
            Make Payment
          </Link>
        </div>

        <div className={styles.announcements}>
          <h2>Recent Announcements</h2>
          <div className={styles.cardContent}>
            {announcements && announcements.length > 0 ? (
              announcements.slice(0, 3).map((item) => (
                <div key={item.id} className={styles.announcementItem}>
                  {item.announcement}
                </div>
              ))
            ) : (
              <p>No recent announcements.</p>
            )}
          </div>
        </div>

        <div className={styles.maintenanceRequests}>
          <div>
            <h2>Maintenance Requests</h2>
            <div className={styles.cardContent}>
              {maintenanceRequests && maintenanceRequests.length > 0 ? (
                maintenanceRequests.slice(0, 2).map((req) => (
                  <div key={req.id} className={styles.maintenanceItem}>
                    <span className={styles.maintenanceStatus}>
                      {req.completed ? "✅" : "PENDING"}
                    </span>
                    {req.information}
                  </div>
                ))
              ) : (
                <p>No open maintenance requests.</p>
              )}
            </div>
          </div>
          <div className={styles.cardFooter}>
            <Link to="/maintenance" className={styles.primaryButton}>
              View All Requests
            </Link>
          </div>
        </div>

        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/payments")}
            >
              <span className={styles.actionIcon}>💳</span> Pay Rent
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/maintenance")}
            >
              <span className={styles.actionIcon}>🛠️</span> Submit Request
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/profile")}
            >
              <span className={styles.actionIcon}>👤</span> View Profile
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/contact")}
            >
              <span className={styles.actionIcon}>📞</span> Contact Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
