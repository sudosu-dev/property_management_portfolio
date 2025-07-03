import { useNotifications } from "../Context/NotificationContext";
import styles from "./NotificationDisplay.module.css";

export default function NotificationDisplay() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
        >
          <div className={styles.content}>
            <div className={styles.iconAndMessage}>
              <span className={styles.icon}>
                {notification.type === "success" && "✓"}
                {notification.type === "error" && "✕"}
                {notification.type === "warning" && "⚠"}
                {notification.type === "info" && "ℹ"}
              </span>
              <span className={styles.message}>{notification.message}</span>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
