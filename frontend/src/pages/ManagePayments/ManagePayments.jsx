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
    console.log("Attempting to open Add Charge modal for:", tenant);

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

  if (loading)
    return (
      <div className={styles.page}>
        <p>Loading tenant balances...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.page}>
        <p>Error loading data: {error}</p>
      </div>
    );

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Tenant Payments & Balances</h1>
        </header>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search by name or unit..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableSection}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tenantColumn}>Tenant</th>
                <th className={styles.noWrap}>Unit #</th>
                <th className={styles.alignRight}>Balance</th>
                <th className={styles.alignRight}>Actions</th>
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
                    >
                      {formatCurrency(item.balance)}
                    </td>
                    <td className={styles.actionsCell}>
                      <button onClick={() => handleOpenChargeModal(item)}>
                        Add Charge
                      </button>
                      <button onClick={() => handleOpenPaymentModal(item)}>
                        Record Payment
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/ledger/${item.user_id}`)
                        }
                      >
                        Ledger
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No tenants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
