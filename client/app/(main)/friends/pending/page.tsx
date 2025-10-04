"use client";
import { PendingComponent } from "@/components/pending-component";
import { useState } from "react";
import { useFriendships } from "@/components/hooks/useFriendships";
import { FriendshipReceiver } from "@/types/friendship";
import { useAppData } from "@/components/providers/app-data-provider";
import { cancelRequest } from "@/app/actions/friends.action";

const PendingPage = () => {

  const [isCancelling, setIsCancelling] = useState("");

  const {mutateFriendships} = useAppData();
  const { relations: pending } = useFriendships("PENDING", "SENT") as { relations: FriendshipReceiver[] };

  const handleCancel = async (id: string) => {
    setIsCancelling(id);
    const res = await cancelRequest(id);
    if(!res.ok) {
      alert(res.message);
    }
    if(res.ok) {
      mutateFriendships((old) => {
        return {
          sent: old.sent.filter(fr => fr.id !== id),
          received: old.received.filter(fr => fr.id !== id),
        }
      });
      alert("Friend Request Canceled Successfully");
    }
    setIsCancelling("");
  }

  if(pending.length === 0) return <div className="p-4 text-center text-white/50">No Pending Requests</div>

  return <div className="p-4">
    {pending.map((friendRequest: FriendshipReceiver) => (
      <PendingComponent key={friendRequest.id} friendRequest={friendRequest} isCanceling={isCancelling} cancelAction={handleCancel}/>
    ))}
  </div>;
}

export default PendingPage
