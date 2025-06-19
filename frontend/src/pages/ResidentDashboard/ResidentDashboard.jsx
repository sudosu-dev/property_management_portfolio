import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { API } from "../../api/ApiContext";
import { useAuth } from "../../auth/AuthContext";
import styles from "./ResidentDashboard.module.css";

export default function ResidentDashboard() {
  const { user, token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [rentCharges, setRentCharges] = useState([]);
  const [utilityCharges, setUtilityCharges] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) return;

    axios
      .get(`${API}/rent_payments/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Failed to fetch rent payments", err));

    axios
      .get(`${API}/rent_charges/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setRentCharges(res.data))
      .catch((err) => console.error("Failed to fetch rent charges", err));

    axios
      .get(`${API}/utilities/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUtilityCharges(res.data))
      .catch((err) => console.error("Failed to fetch utility charges", err));

    axios
      .get(`${API}/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error("Failed to fetch announcements", err));

    axios
      .get(`${API}/maintenance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMaintenanceRequests(res.data))
      .catch((err) =>
        console.error("Failed to fetch maintenance requests", err)
      );
  }, [token, user]);

  function calcBalance() {
    const totalPayments = payments.reduce(
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

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function getFirstDayOfNextMonth() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, "0");
    const day = String(nextMonth.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getAccountStatus() {
    if (
      payments.length === 0 &&
      rentCharges.length === 0 &&
      utilityCharges.length === 0
    ) {
      return "Loading...";
    }

    const balance = calcBalance();
    if (balance <= 0) {
      return "Current";
    } else {
      return `Balance Due: ${formatCurrency(balance)}`;
    }
  }
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <header>
          <h1>Welcome back {user?.first_name || "User"}</h1>
          <p>Account status: {getAccountStatus()}</p>
        </header>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Account Balance Summary</h2>
        <div className={styles.balanceContainer}>
          <div className={styles.amountCard}>
            <p className={styles.balanceAmount}>
              {formatCurrency(calcBalance())}
            </p>
          </div>
          <div className={styles.dueDateCard}>
            <p className={styles.dueDateLabel}>Next due:</p>
            <p className={styles.dueDate}>{getFirstDayOfNextMonth()}</p>
          </div>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => navigate("/payments")}
        >
          View Statement
        </button>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Announcements</h2>
        <div className={styles.announcementsCard}>
          {announcements.slice(0, 3).map((announcement) => (
            <div key={announcement.id} className={styles.announcementItem}>
              • {announcement.announcement} (
              {new Date(announcement.date).toLocaleDateString()})
            </div>
          ))}
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => navigate("/announcements")}
        >
          View All
        </button>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Maintenance Status</h2>
        <p className={styles.openRequestsCount}>
          Open requests:{" "}
          {maintenanceRequests.filter((req) => !req.completed).length}
        </p>
        <div className={styles.maintenanceCard}>
          {maintenanceRequests.slice(0, 2).map((request) => (
            <div key={request.id} className={styles.maintenanceItem}>
              <span
                dangerouslySetInnerHTML={{
                  __html: request.completed ? "&#9989;" : "&#128295;",
                }}
              />{" "}
              {request.information} (
              {new Date(request.created_at).toLocaleDateString()}){" "}
              {request.completed ? "DONE" : ""}
            </div>
          ))}
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => navigate("/maintenance")}
        >
          View All
        </button>
        <button
          className={styles.secondaryButton}
          onClick={() => navigate("/maintenance")}
        >
          Submit New Request
        </button>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/payments")}
          >
            <span
              className={styles.actionIcon}
              dangerouslySetInnerHTML={{ __html: "&#128179;" }}
            />
            Pay Rent
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/maintenance")}
          >
            <span
              className={styles.actionIcon}
              dangerouslySetInnerHTML={{ __html: "&#128295;" }}
            />
            Submit Maintenance Request
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/profile")}
          >
            <span
              className={styles.actionIcon}
              dangerouslySetInnerHTML={{ __html: "&#128100;" }}
            />
            View Profile
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/contact")}
          >
            <span
              className={styles.actionIcon}
              dangerouslySetInnerHTML={{ __html: "&#128222;" }}
            />
            Contact Manager
          </button>
        </div>
      </div>
    </div>
  );
}
