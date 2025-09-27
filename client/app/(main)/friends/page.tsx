"use client"

import { FriendComponent } from "@/components/friend-component";
import { getFriends } from "./friends";
import { useFetch } from "@/components/hooks/useFetch";
import { User } from "@/generated/prisma";

const FriendsPage = () => {

  const {data : friends, loading, error} =  useFetch("friends", getFriends)

  if(loading) return <div className="p-4">Loading...</div>

  if(error) return <div className="p-4 text-center text-red-500">Error: {error.toString()}</div>
  
  if(!friends || friends.length === 0) return <div className="p-4 text-center text-white/50">No Friends</div>

  return (
    <div>
      {friends.map((friend: User) => <FriendComponent key={`friends-${friend.id}`} friend={friend}/>)}
    </div>
  );
}

export default FriendsPage
