"use client";
import { PendingComponent } from "@/components/pending-component";
import { useState } from "react";
import { useFriendships } from "@/components/hooks/useFriendships";
import { FriendshipReceiver } from "@/types/friendship";

const PendingPage = () => {

  const [isCancelling, ] = useState(false);

  const { relations: pending } = useFriendships("PENDING", "SENT") as { relations: FriendshipReceiver[] };

  const handleCancel = async (id: string) => {
    console.log("Cancelling request with id:", id);
  }

  if(pending.length === 0) return <div className="p-4 text-center text-white/50">No Pending Requests</div>

  return <div className="p-4">
    {pending.map((friendRequest: FriendshipReceiver) => (
      <PendingComponent key={friendRequest.id} friendRequest={friendRequest} isCanceling={isCancelling} cancelAction={handleCancel}/>
    ))}
  </div>;
}

export default PendingPage
