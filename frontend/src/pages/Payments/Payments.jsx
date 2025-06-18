import styles from "./Payments.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../api/ApiContext";

export default function Payments() {
  const [pastPayments, setPastPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/rent_payments`)
      .then((res) => {
        console.log("payments loaded:", res.data);
        setPastPayments(res.data);
      })
      .catch((err) => console.error("Failed to fetch rent payments", err));
  }, []);

  return (
    <div className={styles.page}>
      <h1>Payments</h1>
      <div className={styles.sectionLayout}>
        <section className={styles.currentBalance}>
          <div>
            <h2>Your Current Balance</h2>
            <p>$$$</p>
            <p>Next bill due on...</p>
          </div>
          <div>
            <p>If you set up auto pay - you have a scheduled payment for...</p>
            <p>If you have not set up auto pay - hide</p>
          </div>
          <div>
            <button>Make Payment</button>
            <button>Set Up Autopay</button>
          </div>
          <div>
            <table>
              <caption>Rent Charge Breakdown</caption>
              <thead>
                <th>Description</th>
                <th>Amount</th>
              </thead>
              <tbody>
                <tr>
                  <td>Rent</td>
                  <td>$$$</td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td>Total Balance</td>
                  <td>$$$</td>
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
                <p>No payments found.</p>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
