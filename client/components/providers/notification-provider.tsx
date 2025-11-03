"use client"

import { createContext, useContext, useRef, useReducer } from "react"

interface Notification {
  date: Date,
  notificationTitle: string,
  type: "NEW_REQUEST" | "REQUEST_ACCEPTED" | "REQUEST_DECLINED",
  message: string
}

interface NotificationContext {
  getNotifications: () => Notification[];
  pushNotification: (val: Notification) => void;
}

const notificationContext = createContext<NotificationContext | null>(null);

export const NotificationProvider = ({children} : {children: React.ReactNode}) => {
  const notifications : Notification[] = [];
  const notificationsRef = useRef(notifications);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const getNotifications = () => {
    return notificationsRef.current || [];
  }

  const pushNotification = (val: Notification) => {
    notificationsRef.current.push(val);
    forceUpdate();
  }

  return (
    <notificationContext.Provider value={{getNotifications, pushNotification}}>
      {children}
    </notificationContext.Provider>
  )
}

export const useNotification = () => {
  return useContext(notificationContext)!
}
