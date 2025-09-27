"use client";
import { Friendship } from "@/generated/prisma";
import { fetchFriendRequests } from "../friends";
import { PendingComponent } from "@/components/pending-component";
import { useFetch } from "@/components/hooks/useFetch";

interface FriendshipProps extends Friendship {
  receiver: {
    id: string;
    name: string;
    pfp: string | null;
  }
}

const PendingPage = () => {

  const {data: pending, loading, error} = useFetch("pendind",async () => await fetchFriendRequests("SENT"));

  if(loading) return <div className="p-4">Loading...</div>

  if(error) return <div className="p-4 text-center text-red-500">Error: {error.toString()}</div>

  if(!pending || pending.length === 0) return <div className="p-4 text-center text-white/50">No Pending Friend Requests</div>


  return <div className="p-4">
    {pending.map((friendRequest: FriendshipProps) => (
      <PendingComponent key={friendRequest.id} friendRequest={friendRequest} />
    ))}
  </div>;
}

export default PendingPage
