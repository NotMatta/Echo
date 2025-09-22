import { FriendComponent } from "@/components/friend-component";
import { getFriends } from "./friends";

const FriendsPage = async () => {

  const friends = await getFriends();

  if(!friends) return <div className="p-4">Loading...</div>
  
  if(!friends.data || friends.data.length === 0) return <div className="p-4 text-center text-white/50">No Friends</div>

  return (
    <div>
      {friends.data.map((friend, key) => <FriendComponent key={key} friend={friend}/>)}
    </div>
  );
}

export default FriendsPage
