"use client"
import { Status, User } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { useCache } from "../providers/cache-provider";
import { FriendshipInitiator, FriendshipReceiver } from "@/types/friendship";
import { type Friendships, useAppData } from "../providers/app-data-provider";

export interface FriendWithId extends User {
  friendshipId: string;
}


export const useFriendships = (status: Status, type?: "SENT" | "RECEIVED") => {
  const {friendships} = useAppData();
  const { get } = useCache()!;
  const [relations, setRelations] = useState<FriendWithId[] | FriendshipInitiator[] | FriendshipReceiver[]>([]);

  useEffect(() => {
    const fetchRelations = () => {
      const cached = get("friendships").data as Friendships;
      if(!cached) return;
      const cachedFriends: FriendWithId[] = [];
      if(status === "PENDING" && type) {
        type === "SENT" ? setRelations(cached.sent.filter(f => f.status === "PENDING")) : setRelations(cached.received.filter(f => f.status === "PENDING"));
        return;
      }
      cached.sent.filter(friendship => friendship.status === status).forEach(friendship => {
        cachedFriends.push({...friendship.receiver, friendshipId: friendship.id} as FriendWithId);
      });
      cached.received.filter(friendship => friendship.status === status).forEach(friendship => {
        cachedFriends.push({...friendship.initiator, friendshipId: friendship.id} as FriendWithId);
      });
      setRelations(cachedFriends);
    }
    fetchRelations();
  },[friendships])

  return {relations, setRelations};
}
