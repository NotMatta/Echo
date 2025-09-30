"use client"

import { FriendComponent } from "@/components/friend-component";
import { User } from "@/generated/prisma";
import { useFriendships } from "@/components/hooks/useFriendships";

const FriendsPage = () => {

  const {relations : friends} = useFriendships("FRIENDS") as {relations: User[]};

  return (
    <div>
      {friends.map((friend: User) => <FriendComponent key={`friends-${friend.id}`} friend={friend}/>)}
    </div>
  );
}

export default FriendsPage
