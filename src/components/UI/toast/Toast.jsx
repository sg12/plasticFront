import { useState, useEffect } from "react";
import styles from "./Toast.module.scss";

const Toast = ({ notifications, setNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Add a check for notifications
      setShowNotifications(true);

      const timer = setTimeout(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification, index) => ({
            ...notification,
            fadeOut: index === 0 ? true : notification.fadeOut,
          }))
        );

        setTimeout(() => {
          setNotifications((prevNotifications) => prevNotifications.slice(1));
          // setShowNotifications(false);
        }, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notifications, setNotifications]);

  if (!notifications || notifications.length === 0) {
    return null; 
  }

  return (
    <div className={styles.edit__popupContainer}>
      {showNotifications &&
        notifications.map((notification, index) => (
          <div
            key={index}
            className={`${styles.edit__popup} ${
              notification.fadeOut ? styles.fadeOut : ""
            } ${index === 0 ? styles.active : ""}`}
          >
            <span className={styles.edit__title}>{notification.title}</span>
            <span className={styles.edit__subtitle}>
              {notification.subtitle}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Toast;
