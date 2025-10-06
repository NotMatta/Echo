"use client"

import { FriendComponent } from "@/components/friend-component";
import { Friends } from "@/types/friendship";
import { useAppData } from "@/components/providers/app-data-provider";
import { unfriend } from "@/app/actions/friends.action";
import { useState } from "react";

const FriendsPage = () => {

  const [isUnfriending, setIsUnfriending] = useState("");
  const {mutateFriends ,mutateFriendships, friends} = useAppData();

  const handleDelete = async (id: string) => {
    setIsUnfriending(id);
    const res = await unfriend(id);
    if(!res.ok) {
      alert(res.message);
    }
    if(res.ok) {
      mutateFriendships((old) => {
        return {
          sent: old.sent.filter(fr => fr.id !== id),
          received: old.received.filter(fr => fr.id !== id),
        }
      });
      mutateFriends((old) => old.filter(f => f.id !== id));
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
