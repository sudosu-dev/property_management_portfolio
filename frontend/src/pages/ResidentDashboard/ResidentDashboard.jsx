import React from "react";
import styles from "./ResidentDashboard.module.css";

export default function ResidentDashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <header>
          <h1>Welcome back YOUR NAME HERE</h1>
          <p>Account status: CURRENT/BALANCE DUE</p>
        </header>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Account Balance Summary</h2>
        <div className={styles.balanceContainer}>
          <div className={styles.amountCard}></div>
          <div className={styles.dueDateCard}></div>
        </div>
        <button className={styles.primaryButton}>View Statement</button>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Announcements</h2>
        <div className={styles.announcementsCard}></div>
        <button className={styles.primaryButton}>View All</button>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Maintenance Status</h2>
        <p className={styles.openRequestsCount}>
          Open Requests NUM OPEN REQUESTS
        </p>
        <div className={styles.maintenanceCard}></div>
        <button className={styles.primaryButton}>View All</button>
        <button className={styles.secondaryButton}>Submit New Request</button>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton}>Pay Rent</button>
          <button className={styles.actionButton}>
            Submit Maintenance Request
          </button>
          <button className={styles.actionButton}>View Profile</button>
          <button className={styles.actionButton}>Contact Manager</button>
        </div>
      </div>
    </div>
  );
}
