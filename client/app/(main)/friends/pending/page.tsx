import { Friendship } from "@/generated/prisma";
import { fetchFriendRequests } from "../friends";
import { PendingComponent } from "@/components/pending-component";

interface FriendshipProps extends Friendship {
  receiver: {
    id: string;
    name: string;
    pfp: string | null;
  }
}

const PendingPage = async () => {

  const pendingData = await fetchFriendRequests("SENT");

  if(!pendingData) return <div className="p-4">Loading...</div>

  return <div className="p-4">
    {pendingData.ok && pendingData.data.length > 0 ? pendingData.data.map((friendRequest: FriendshipProps) => (
      <PendingComponent key={friendRequest.id} friendRequest={friendRequest} />
    )) : <p className="text-center text-white/50">No Pending Friend Requests</p>}
  </div>;
}

export default PendingPage
