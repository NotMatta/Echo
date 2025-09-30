"use client"
import { RequestComponent } from "@/components/request-component";
import { useFriendships } from "@/components/hooks/useFriendships";
import { FriendshipInitiator } from "@/types/friendship";

const RequestsPage = () => {

  const {relations: requests} = useFriendships("PENDING", "RECEIVED") as {relations: FriendshipInitiator[]};

  if(requests.length === 0) return <div className="p-4 text-center text-white/50">No Friend Requests</div>

  return <div className="p-4">
    {requests.map((friendRequest: FriendshipInitiator) => <RequestComponent key={friendRequest.id} friendRequest={friendRequest} />)}
  </div>;
}

export default RequestsPage
