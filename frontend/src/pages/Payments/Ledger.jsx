import styles from "./Ledger.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../../api/ApiContext";

export default function Ledger() {
  const [payments, setPayments] = useState([]);
  const [rentCharges, setRentCharges] = useState([]);
  const [utilityCharges, setUtilityCharges] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/rent_payments`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzUwMTA4NzgwLCJleHAiOjE3NTA3MTM1ODB9.N1t7wpbncRuhQwI8Z7MFkNbuI1Zleamlz3ZzRO3T-k4`,
        },
      })
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Failed to fetch rent payments", err));

    axios
      .get(`${API}/rent_charges/my`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzUwMTA4NzgwLCJleHAiOjE3NTA3MTM1ODB9.N1t7wpbncRuhQwI8Z7MFkNbuI1Zleamlz3ZzRO3T-k4`,
        },
      })
      .then((res) => setRentCharges(res.data))
      .catch((err) => console.error("Failed to fetch rent charges", err));

    axios
      .get(`${API}/utility_information/my`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzUwMTA4NzgwLCJleHAiOjE3NTA3MTM1ODB9.N1t7wpbncRuhQwI8Z7MFkNbuI1Zleamlz3ZzRO3T-k4`,
        },
      })
      .then((res) => setUtilityCharges(res.data))
      .catch((err) => console.error("Failed to fetch utility charges", err));
  }, []);

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const combinedCharges = [
    ...payments.map((p) => ({
      type: "payment",
      id: p.id,
      date: p.paid_date,
      description: "Resident Payment",
      amount: -p.payment_amount,
      user_id: p.user_id,
    })),
    ...rentCharges.map((r) => ({
      type: "rent",
      id: `${r.unit_id}-${r.created_at}`,
      date: r.created_at,
      description: "Monthly Rent",
      amount: parseFloat(r.rent_amount),
      user_id: r.user_id,
    })),
    ...utilityCharges.map((u) => ({
      type: "utility",
      id: u.id,
      date: u.created_at,
      description: "Utility Charge",
      amount: (u.water_cost || 0) + (u.electric_cost || 0) + (u.gas_cost || 0),
      user_id: u.user_id,
    })),
  ];

  combinedCharges.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className={styles.page}>
      <h1>Account Ledger</h1>
      <div className={styles.tableContainer}>
        <p>Showing all transactions</p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Paid By</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {combinedCharges.length > 0 ? (
              (() => {
                let runningBalance = 0;
                return combinedCharges.map((item) => {
                  runningBalance += item.amount;
                  return (
                    <tr key={`${item.type}-${item.id}`}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.description}</td>
                      <td>{item.user_id}</td>
                      <td>
                        {item.amount > 0 ? formatCurrency(item.amount) : ""}
                      </td>
                      <td>
                        {item.amount < 0 ? formatCurrency(-item.amount) : ""}
                      </td>
                      <td>{formatCurrency(runningBalance)}</td>
                    </tr>
                  );
                });
              })()
            ) : (
              <tr>
                <td colSpan={6}>No ledger entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
