"use client";
import { Friendship } from "@/generated/prisma";
import { fetchFriendRequests, cancelRequest } from "../friends";
import { PendingComponent } from "@/components/pending-component";
import { useFetch } from "@/components/hooks/useFetch";
import { useState } from "react";

interface FriendshipProps extends Friendship {
  receiver: {
    id: string;
    name: string;
    pfp: string | null;
  }
}

const PendingPage = () => {

  const {data: pending, loading, error, mutate} = useFetch<FriendshipProps[]>("pending",async () => await fetchFriendRequests("SENT"));
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async (id: string) => {
    if(loading && isCancelling) return;
    const { ok, message } = await cancelRequest(id);
    if(!ok) return alert("Error: " + message);
    const newPending = pending?.filter((request: FriendshipProps) => request.id !== id);
    mutate(newPending);
    setIsCancelling(false);
  }

  if(loading) return <div className="p-4">Loading...</div>

  if(error) return <div className="p-4 text-center text-red-500">Error: {error.toString()}</div>

  if(!pending || pending.length === 0) return <div className="p-4 text-center text-white/50">No Pending Friend Requests</div>


  return <div className="p-4">
    {pending.map((friendRequest: FriendshipProps) => (
      <PendingComponent key={friendRequest.id} friendRequest={friendRequest} isCanceling={isCancelling} cancelAction={handleCancel}/>
    ))}
  </div>;
}

export default PendingPage
