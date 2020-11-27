import React, { useState } from "react";
import Style from "./notification.module.css";
const NotificationContext = React.createContext<Partial<contextProps>>({});

interface INotification {
  message: string;
  type?: "error" | "success";
  options?: any;
}

type contextProps = {
  notifications: INotification[];
  notify: any;
  clearNotifications: any;
};

const NotificationProvider = (props: any) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const notify = (message: string, type?: any) =>
    setNotifications(notifications.concat({ message, type }));

  const clearNotifications = () => setNotifications([]);

  const implementation = {
    notify,
    notifications,
    clearNotifications,
  };
  return (
    <NotificationContext.Provider value={implementation}>
      {props.children}
      {notifications?.length > 0 && (
        <section data-testid="Notification" className={Style.Notifications}>
          <ol>
            {notifications.map((notification, index) => (
              <li
                key={index}
                data-status={notification.type}
                className={Style.Notification}
                style={{ ["--index" as any]: index }}
              >
                <p>{notification.message}</p>
              </li>
            ))}
          </ol>
          <button onClick={() => clearNotifications()} className={Style.Clear}>
            Clear all
          </button>
        </section>
      )}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
