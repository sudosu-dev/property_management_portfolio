import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import useQuery from "../../api/useQuery";
import styles from "./ManagerDashboard.module.css";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: balances, loading: loadingBalances } = useQuery(
    "/transactions/all-balances",
    "allBalances"
  );
  const { data: units, loading: loadingUnits } = useQuery("/units", "allUnits");
  const { data: maintenance, loading: loadingMaint } = useQuery(
    "/maintenance?completed=false",
    "openMaintenance"
  );

  const dashboardStats = useMemo(() => {
    if (!balances || !units || !maintenance) {
      return {
        outstandingBalance: 0,
        occupancyRate: 0,
        openTickets: 0,
        topOverdueTenants: [],
      };
    }

    const outstandingBalance = balances.reduce((sum, tenant) => {
      const balance = parseFloat(tenant.balance);
      return balance > 0 ? sum + balance : sum;
    }, 0);

    const occupancyRate =
      units.filter((u) => u.tenant_info?.id).length / units.length;

    const topOverdueTenants = balances
      .filter((t) => parseFloat(t.balance) > 0)
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
      .slice(0, 3);

    return {
      outstandingBalance,
      occupancyRate,
      openTickets: maintenance.length,
      topOverdueTenants,
    };
  }, [balances, units, maintenance]);

  const isLoading = loadingBalances || loadingUnits || loadingMaint;

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p>Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Manager Dashboard</h1>
        <p>
          Welcome back, {user?.first_name || "Manager"}. Here's a summary of
          your property.
        </p>
      </header>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <p className={styles.kpiValue}>
            {dashboardStats.outstandingBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          <p className={styles.kpiLabel}>Outstanding Balance</p>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiValue}>
            {(dashboardStats.occupancyRate * 100).toFixed(0)}%
          </p>
          <p className={styles.kpiLabel}>Occupancy Rate</p>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiValue}>{dashboardStats.openTickets}</p>
          <p className={styles.kpiLabel}>Open Maintenance Tickets</p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Financial Snapshot</h2>
          <div>
            <strong>Top Overdue Tenants:</strong>
            {dashboardStats.topOverdueTenants.length > 0 ? (
              dashboardStats.topOverdueTenants.map((t) => (
                <div key={t.user_id} className={styles.listItem}>
                  <span>
                    {t.first_name} {t.last_name} (Unit {t.unit_number})
                  </span>
                  <Link to={`/admin/ledger/${t.user_id}`}>View Ledger</Link>
                </div>
              ))
            ) : (
              <p>No overdue tenants. Great job!</p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Maintenance Triage</h2>
          <div>
            {maintenance && maintenance.length > 0 ? (
              maintenance.slice(0, 3).map((t) => (
                <div key={t.id} className={styles.listItem}>
                  <span>
                    Unit {t.unit_number}: {t.information}
                  </span>
                  <Link to="/admin/maintenance">View</Link>
                </div>
              ))
            ) : (
              <p>No open maintenance requests.</p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/utilities")}
            >
              <span className={styles.actionIcon}>💡</span> Enter Utilities
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/payments")}
            >
              <span className={styles.actionIcon}>💰</span> Manage Balances
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/announcements")}
            >
              <span className={styles.actionIcon}>📢</span> New Announcement
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/maintenance")}
            >
              <span className={styles.actionIcon}>🛠️</span> All Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
