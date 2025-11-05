"use client";

import { Friends, FriendshipInitiator } from "@/types/friendship";
import { useAppData } from "./providers/app-data-provider";
import { useSocket } from "./providers/socket-provider";
import { useEffect } from "react";
import { useNotification } from "./providers/notification-provider";

export const SocketListener = () => {
  const { socket } = useSocket();
  const {pushNotification} = useNotification()
  const { setFriends, setRequests, setPendings } = useAppData()!;

  useEffect(() => {
    if (!socket) return;
    
    socket.on("friend-online", (data: { userId: string }) => {
      setFriends((old) => {
        return old.map((friend) => {
          if (friend.id === data.userId) {
            return { ...friend, online: true };
          }
          return friend;
        });
      });
    });

    socket.on("friend-offline", (data: { userId: string }) => {
      setFriends((old) => {
        return old.map((friend) => {
          if (friend.id === data.userId) {
            return { ...friend, online: false };
          }
          return friend;
        });
      });
    });

    socket.on("new-friend-request", (data: FriendshipInitiator ) => {
      setRequests((old) => [data, ...old]);
      pushNotification({
        date: new Date(),
        notificationTitle: "New friend request",
        type: "NEW_REQUEST",
        message: "New request from " + data.initiator.name
      })
    });

    socket.on("friend-unfriended", (data: { friendshipId: string }) => {
      setFriends((old) => old.filter((friend) => friend.friendshipId !== data.friendshipId));
    });

    socket.on("friend-request-accepted", (data: Friends ) => {
      alert("Receiver Accepted your request")
      console.log(data)
      setPendings((old) => old.filter((pending) => pending.id !== data.friendshipId));
      setFriends((old) => [data, ...old]);
    });

    socket.on("friend-request-declined", (data: { friendshipId: string }) => {
      setPendings((old) => old.filter((pen) => pen.id !== data.friendshipId));
    });

    socket.on("friend-request-cancelled", (data: { friendshipId: string }) => {
      setRequests((old) => old.filter((req) => req.id !== data.friendshipId));
      setPendings((old) => old.filter((req) => req.id !== data.friendshipId));
    });

    socket.on("test-event", () => {
      alert("broadcasted")
    })

    return () => {
      socket.off("friend-online");
      socket.off("friend-offline");
      socket.off("new-friend-request");
      socket.off("friend-unfriended");
      socket.off("friend-request-accepted");
      socket.off("friend-request-declined");
      socket.off("friend-request-cancelled");
      socket.off("test-event");
    };
  }, [socket, setFriends]);

  return <></>;
}
