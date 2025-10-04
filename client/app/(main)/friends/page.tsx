"use client"

import { FriendComponent } from "@/components/friend-component";
import { User } from "@/generated/prisma";
import { FriendWithId, useFriendships } from "@/components/hooks/useFriendships";
import { useAppData } from "@/components/providers/app-data-provider";
import { unfriend } from "@/app/actions/friends.action";
import { useState } from "react";

const FriendsPage = () => {

  const [isUnfriending, setIsUnfriending] = useState("");
  const {relations : friends} = useFriendships("FRIENDS") as {relations: FriendWithId[]};
  const {mutateFriendships} = useAppData();

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
      alert("Unfriended Successfully");
    }
    setIsUnfriending("");
  }
    

  return (
    <div>
      {friends.map((friend: FriendWithId) => <FriendComponent key={`friends-${friend.id}`} friend={friend} deleteAction={handleDelete} isDeleting={isUnfriending}/>)}
    </div>
  );
}

export default FriendsPage
