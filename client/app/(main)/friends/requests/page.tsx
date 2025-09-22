import { Friendship } from "@/generated/prisma";
import { fetchFriendRequests } from "../friends";
import { RequestComponent } from "@/components/request-component";

interface FriendshipProps extends Friendship {
  initiator: {
    id: string;
    name: string;
    pfp: string | null;
  }
}

const RequestsPage = async () => {

  const requestsData = await fetchFriendRequests("RECEIVED");

  if(!requestsData) return <div className="p-4">Loading...</div>

  return <div className="p-4">
    {requestsData.ok && requestsData.data.length > 0 ? requestsData.data.map((friendRequest: FriendshipProps) => (
      <RequestComponent key={friendRequest.id} friendRequest={friendRequest} />
    )) : <p className="text-center text-white/50">No Friend Requests Recieved</p>}
  </div>;
}

export default RequestsPage
