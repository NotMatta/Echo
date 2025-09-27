"use client"
import { Friendship } from "@/generated/prisma";
import { fetchFriendRequests } from "../friends";
import { RequestComponent } from "@/components/request-component";
import { useFetch } from "@/components/hooks/useFetch";

interface FriendshipProps extends Friendship {
  initiator: {
    id: string;
    name: string;
    pfp: string | null;
  }
}

const RequestsPage = () => {

  const {data: requests, loading, error} = useFetch("requests",async () => await fetchFriendRequests("RECEIVED"));

  if(loading) return <div className="p-4">Loading...</div>

  if(error) return <div className="p-4 text-center text-red-500">Error: {error.toString()}</div>

  if(!requests || requests.length === 0) return <div className="p-4 text-center text-white/50">No Friend Requests Recieved</div>

  return <div className="p-4">
    {requests.map((friendRequest: FriendshipProps) => <RequestComponent key={friendRequest.id} friendRequest={friendRequest} />)}
  </div>;
}

export default RequestsPage
