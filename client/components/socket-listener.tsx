"use client";

import { useAppData } from "./providers/app-data-provider";
import { useSocket } from "./providers/socket-provider";
import { useEffect } from "react";

export const SocketListener = () => {
  const { socket } = useSocket();
  const { mutateFriends } = useAppData();

  useEffect(() => {
    if (!socket) return;
    
    socket.on("friend-online", (data: { userId: string }) => {
      mutateFriends((old) => {
        return old.map((friend) => {
          if (friend.id === data.userId) {
            return { ...friend, online: true };
          }
          return friend;
        });
      });
    });

    socket.on("friend-offline", (data: { userId: string }) => {
      mutateFriends((old) => {
        return old.map((friend) => {
          if (friend.id === data.userId) {
            return { ...friend, online: false };
          }
          return friend;
        });
      });
    });

    socket.on("test-event", () => {
      alert("broadcasted")
    })

    return () => {
      socket.off("friend-online");
      socket.off("friend-offline");
      socket.off("test-event");
    };
  }, [socket, mutateFriends]);

  return <></>;
}
