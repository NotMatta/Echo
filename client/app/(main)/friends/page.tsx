"use client"

import { FriendComponent } from "@/components/friend-component";
import { Friends } from "@/types/friendship";
import { unfriend } from "@/app/actions/friends.action";
import { useState } from "react";
import { useAppData } from "@/components/providers/app-data-provider";

const FriendsPage = () => {

  const [isUnfriending, setIsUnfriending] = useState("");
  const {friends, setFriends} = useAppData()!;

  const handleDelete = async (id: string) => {
    setIsUnfriending(id);
    const res = await unfriend(id);
    if(!res.ok) {
      alert(res.message);
    } else {
      setFriends((old) => old.filter(f => f.id !== id));
      alert("Unfriended Successfully");
    }
    setIsUnfriending("");
  }

  return (
    <div>
      {friends.map((friend: Friends) => <FriendComponent key={`friends-${friend.id}`} friend={friend} deleteAction={handleDelete} isDeleting={isUnfriending}/>)}
    </div>
  );
}

export default FriendsPage
