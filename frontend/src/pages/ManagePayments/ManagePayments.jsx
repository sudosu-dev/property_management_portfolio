import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "../../api/useQuery";
import styles from "./ManagePayments.module.css";
import AddChargeModal from "./AddChargeModal";
import RecordPaymentModal from "./RecordPaymentModal";

export default function ManagePayments() {
  const navigate = useNavigate();
  const {
    data: balances,
    loading,
    error,
    query: refetchBalances,
  } = useQuery("/transactions/all-balances", "balances");
  const [searchTerm, setSearchTerm] = useState("");

  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const handleOpenChargeModal = (tenant) => {
    setSelectedTenant(tenant);
    setIsChargeModalOpen(true);
  };

  const handleOpenPaymentModal = (tenant) => {
    setSelectedTenant(tenant);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsChargeModalOpen(false);
    setIsPaymentModalOpen(false);
    setSelectedTenant(null);
  };

  const handleSuccess = () => {
    refetchBalances();
  };

  function formatCurrency(amount) {
    return parseFloat(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function getBalanceStyle(balance) {
    const numericBalance = parseFloat(balance);
    if (numericBalance > 0) return styles.balancePositive;
    if (numericBalance < 0) return styles.balanceNegative;
    return styles.balanceZero;
  }

  const filteredBalances = balances?.filter(
    (item) =>
      `${item.first_name} ${item.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.unit_number.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.loadingContainer}
          role="status"
          aria-label="Loading tenant balances"
        >
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading tenant balances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer} role="alert">
          <h1>Error Loading Data</h1>
          <p>Unable to load tenant balances: {error}</p>
          <button
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
            aria-label="Reload the page to try again"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Tenant Payments & Balances</h1>
          <p className={styles.description}>
            Manage tenant balances, add charges, record payments, and view
            account ledgers
          </p>
        </header>

        <main className={styles.content}>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search by name or unit..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search tenants by name or unit number"
            />
          </div>

          {/* Desktop Table View */}
          <div className={styles.desktopView}>
            <div className={styles.tableSection}>
              <table
                className={styles.table}
                role="table"
                aria-label="Tenant payments and balances management table"
              >
                <thead>
                  <tr>
                    <th scope="col" className={styles.tenantColumn}>
                      Tenant
                    </th>
                    <th scope="col" className={styles.noWrap}>
                      Unit #
                    </th>
                    <th scope="col" className={styles.alignRight}>
                      Balance
                    </th>
                    <th scope="col" className={styles.alignRight}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBalances && filteredBalances.length > 0 ? (
                    filteredBalances.map((item) => (
                      <tr key={item.user_id}>
                        <td>{`${item.first_name} ${item.last_name}`}</td>
                        <td>{item.unit_number}</td>
                        <td
                          className={`${styles.alignRight} ${getBalanceStyle(
                            item.balance
                          )}`}
                          aria-label={`Balance: ${formatCurrency(
                            item.balance
                          )}`}
                        >
                          {formatCurrency(item.balance)}
                        </td>
                        <td className={styles.actionsCell}>
                          <button
                            onClick={() => handleOpenChargeModal(item)}
                            className={styles.actionButton}
                            aria-label={`Add charge for ${item.first_name} ${item.last_name}`}
                          >
                            Add Charge
                          </button>
                          <button
                            onClick={() => handleOpenPaymentModal(item)}
                            className={styles.actionButton}
                            aria-label={`Record payment for ${item.first_name} ${item.last_name}`}
                          >
                            Record Payment
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/ledger/${item.user_id}`)
                            }
                            className={styles.actionButton}
                            aria-label={`View ledger for ${item.first_name} ${item.last_name}`}
                          >
                            Ledger
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={styles.emptyState}>
                        No tenants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className={styles.mobileView}>
            {filteredBalances && filteredBalances.length > 0 ? (
              <ul className={styles.tenantCards} role="list">
                {filteredBalances.map((item) => (
                  <li key={item.user_id} className={styles.tenantCard}>
                    <div className={styles.cardHeader}>
                      <h2>{`${item.first_name} ${item.last_name}`}</h2>
                      <span className={styles.unitBadge}>
                        Unit {item.unit_number}
                      </span>
                    </div>

                    <div className={styles.cardContent}>
                      <div className={styles.balanceSection}>
                        <span className={styles.balanceLabel}>Balance:</span>
                        <span
                          className={`${styles.balanceAmount} ${getBalanceStyle(
                            item.balance
                          )}`}
                          aria-label={`Balance: ${formatCurrency(
                            item.balance
                          )}`}
                        >
                          {formatCurrency(item.balance)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        onClick={() => handleOpenChargeModal(item)}
                        className={styles.mobileActionButton}
                        aria-label={`Add charge for ${item.first_name} ${item.last_name}`}
                      >
                        Add Charge
                      </button>
                      <button
                        onClick={() => handleOpenPaymentModal(item)}
                        className={styles.mobileActionButton}
                        aria-label={`Record payment for ${item.first_name} ${item.last_name}`}
                      >
                        Record Payment
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/ledger/${item.user_id}`)
                        }
                        className={styles.mobileActionButton}
                        aria-label={`View ledger for ${item.first_name} ${item.last_name}`}
                      >
                        View Ledger
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.noTenants}>
                <p>No tenants found.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isChargeModalOpen && (
        <AddChargeModal
          tenant={selectedTenant}
          onClose={handleCloseModals}
          onSuccess={handleSuccess}
        />
      )}

      {isPaymentModalOpen && (
        <RecordPaymentModal
          tenant={selectedTenant}
          onClose={handleCloseModals}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
