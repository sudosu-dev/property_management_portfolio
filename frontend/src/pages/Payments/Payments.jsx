import styles from "./Payments.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../api/ApiContext";
import { useAuth } from "../../auth/AuthContext";

export default function Payments() {
  const [pastPayments, setPastPayments] = useState([]);
  const [rentCharges, setRentCharges] = useState([]);
  const [utilityCharges, setUtilityCharges] = useState([]);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) return;

    axios
      .get(`${API}/rent_payments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPastPayments(res.data))
      .catch((err) => console.error("Failed to fetch rent payments", err));

    axios
      .get(`${API}/rent_charges/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRentCharges(res.data))
      .catch((err) => console.error("Failed to fetch rent charges", err));

    axios
      .get(`${API}/utilities/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUtilityCharges(res.data))
      .catch((err) => console.error("Failed to fetch utility charges", err));
  }, [token, user]);

  function calcBalance() {
    const totalPayments = pastPayments.reduce(
      (sum, p) => sum - p.payment_amount,
      0
    );

    const totalRentCharges = rentCharges.reduce(
      (sum, r) => sum + parseFloat(r.rent_amount),
      0
    );

    const totalUtilityCharges = utilityCharges.reduce(
      (sum, u) =>
        sum + (u.water_cost || 0) + (u.electric_cost || 0) + (u.gas_cost || 0),
      0
    );

    return totalPayments + totalRentCharges + totalUtilityCharges;
  }

  function totalRent() {
    return rentCharges.reduce((sum, r) => sum + parseFloat(r.rent_amount), 0);
  }

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const totalUtilityCharges = utilityCharges.reduce(
    (sum, u) =>
      sum + (u.water_cost || 0) + (u.electric_cost || 0) + (u.gas_cost || 0),
    0
  );

  function getFirstDayOfNextMonth() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, "0");
    const day = String(nextMonth.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <div className={styles.page}>
      <h1>Payments</h1>
      <div className={styles.sectionLayout}>
        <section className={styles.currentBalance}>
          <div>
            <h2>Your Current Balance</h2>
            <p>{formatCurrency(calcBalance())}</p>
            <p>Next bill due on {getFirstDayOfNextMonth()}</p>
          </div>
          <div>
            <button>Make Payment</button>
            <button>Set Up Autopay</button>
          </div>
          <div>
            <table>
              <caption>Rent Charge Breakdown</caption>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rent</td>
                  <td>{formatCurrency(totalRent())}</td>
                </tr>
                <tr>
                  <td>Utilities</td>
                  <td>{formatCurrency(totalUtilityCharges)}</td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td>Total Balance</td>
                  <td>{formatCurrency(calcBalance())}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.accountLedger}>
          <h2>Account Ledger</h2>
          <p>Need more help understanding your balance?</p>
          <button onClick={() => navigate("/ledger")}>
            View full account ledger
          </button>
        </section>

        <section className={styles.pastPayments}>
          <p>Past Payments</p>
          <table>
            <tbody>
              {pastPayments && pastPayments.length > 0 ? (
                pastPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.id}>
                    <td>🟢</td>
                    <td>
                      <p>{payment.created_date}</p>
                      <p>{payment.receipt_number}</p>
                    </td>
                    <td>{payment.payment_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="100%">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
