"use client"
import { Status, User } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { useCache } from "../providers/cache-provider";
import { FriendshipInitiator, FriendshipReceiver } from "@/types/friendship";
import { type Friendships, useAppData } from "../providers/app-data-provider";


export const useFriendships = (status: Status, type?: "SENT" | "RECEIVED") => {
  const {friendships} = useAppData();
  const { get } = useCache()!;
  const [relations, setRelations] = useState<User[] | FriendshipInitiator[] | FriendshipReceiver[]>([]);

  useEffect(() => {
    const fetchRelations = () => {
      const cached = get("friendships").data as Friendships;
      if(!cached) return;
      const cachedFriends: User[] = [];
      if(status === "PENDING" && type) {
        type === "SENT" ? setRelations(cached.sent.filter(f => f.status === "PENDING")) : setRelations(cached.received.filter(f => f.status === "PENDING"));
        return;
      }
      cached.sent.filter(friendship => friendship.status === status).forEach(friendship => {
        cachedFriends.push(friendship.receiver as User);
      });
      cached.received.filter(friendship => friendship.status === status).forEach(friendship => {
        cachedFriends.push(friendship.initiator as User);
      });
      setRelations(cachedFriends);
    }
    fetchRelations();
  },[friendships])

  return {relations, setRelations};
}
