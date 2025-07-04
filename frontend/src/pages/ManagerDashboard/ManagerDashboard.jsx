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
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading dashboard data"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading Dashboard Data...</p>
        </div>
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

      <section
        className={styles.kpiRow}
        aria-label="Key performance indicators"
      >
        <div className={styles.kpiCard}>
          <p
            className={styles.kpiValue}
            aria-label={`Outstanding balance: ${dashboardStats.outstandingBalance.toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              }
            )}`}
          >
            {dashboardStats.outstandingBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          <p className={styles.kpiLabel}>Outstanding Balance</p>
        </div>
        <div className={styles.kpiCard}>
          <p
            className={styles.kpiValue}
            aria-label={`Occupancy rate: ${(
              dashboardStats.occupancyRate * 100
            ).toFixed(0)} percent`}
          >
            {(dashboardStats.occupancyRate * 100).toFixed(0)}%
          </p>
          <p className={styles.kpiLabel}>Occupancy Rate</p>
        </div>
        <div className={styles.kpiCard}>
          <p
            className={styles.kpiValue}
            aria-label={`${dashboardStats.openTickets} open maintenance tickets`}
          >
            {dashboardStats.openTickets}
          </p>
          <p className={styles.kpiLabel}>Open Maintenance Tickets</p>
        </div>
      </section>

      <main className={styles.mainGrid}>
        <section className={styles.card} aria-labelledby="financial-heading">
          <h2 id="financial-heading" className={styles.cardTitle}>
            Financial Snapshot
          </h2>
          <div>
            <h3>Top Overdue Tenants:</h3>
            {dashboardStats.topOverdueTenants.length > 0 ? (
              <ul className={styles.tenantList} role="list">
                {dashboardStats.topOverdueTenants.map((t) => (
                  <li key={t.user_id} className={styles.listItem}>
                    <span>
                      {t.first_name} {t.last_name} (Unit {t.unit_number})
                    </span>
                    <Link
                      to={`/admin/ledger/${t.user_id}`}
                      aria-label={`View ledger for ${t.first_name} ${t.last_name}`}
                    >
                      View Ledger
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No overdue tenants. Great job!</p>
            )}
          </div>
        </section>

        <section className={styles.card} aria-labelledby="maintenance-heading">
          <h2 id="maintenance-heading" className={styles.cardTitle}>
            Maintenance Triage
          </h2>
          <div>
            {maintenance && maintenance.length > 0 ? (
              <ul className={styles.maintenanceList} role="list">
                {maintenance.slice(0, 3).map((t) => (
                  <li key={t.id} className={styles.listItem}>
                    <span>
                      Unit {t.unit_number}: {t.information}
                    </span>
                    <Link
                      to="/admin/maintenance"
                      aria-label={`View maintenance request for unit ${t.unit_number}`}
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No open maintenance requests.</p>
            )}
          </div>
        </section>

        <section className={styles.card} aria-labelledby="actions-heading">
          <h2 id="actions-heading" className={styles.cardTitle}>
            Quick Actions
          </h2>
          <div className={styles.actionsGrid}>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/utilities")}
              aria-label="Navigate to utilities page to enter utility readings"
            >
              <span className={styles.actionIcon} aria-hidden="true">
                💡
              </span>
              <span>Enter Utilities</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/payments")}
              aria-label="Navigate to payments page to manage tenant balances"
            >
              <span className={styles.actionIcon} aria-hidden="true">
                💰
              </span>
              <span>Manage Balances</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/announcements")}
              aria-label="Navigate to announcements page to create new announcement"
            >
              <span className={styles.actionIcon} aria-hidden="true">
                📢
              </span>
              <span>New Announcement</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate("/admin/maintenance")}
              aria-label="Navigate to maintenance page to view all maintenance requests"
            >
              <span className={styles.actionIcon} aria-hidden="true">
                🛠️
              </span>
              <span>All Maintenance</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
