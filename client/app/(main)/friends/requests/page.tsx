"use client"
import { RequestComponent } from "@/components/request-component";
import { useFriendships } from "@/components/hooks/useFriendships";
import { FriendshipInitiator } from "@/types/friendship";
import { useAppData } from "@/components/providers/app-data-provider";
import { acceptRequest, declineRequest } from "@/app/actions/friends.action";
import { useState } from "react";

const RequestsPage = () => {

  const {mutateFriendships} = useAppData();
  const [isProcessing, setIsProcessing] = useState("");
  const {relations: requests} = useFriendships("PENDING", "RECEIVED") as {relations: FriendshipInitiator[]};

  const handleAccept = async (id: string) => {
    setIsProcessing(id);
    const res = await acceptRequest(id);
    if(!res.ok) {
      alert(res.message);
    }
    if(res.ok) {
      mutateFriendships((old) => {
        return {
          sent: old.sent,
          received: old.received.map(fr => {
            if(fr.id === id) {
              return {...fr, status: "FRIENDS"};
            }
            return fr;
          })
        }
      });
      alert("Friend Request Accepted Successfully");
    }
    setIsProcessing("");
  }

  const handleDecline = async (id: string) => {
    setIsProcessing(id);
    const res = await declineRequest(id);
    if(!res.ok) {
      alert(res.message);
    }
    if(res.ok) {
      mutateFriendships((old) => {
        return {
          sent: old.sent,
          received: old.received.filter(fr => fr.id !== id),
        }
      });
      alert("Friend Request Declined Successfully");
    }
    setIsProcessing("");
  }

  if(requests.length === 0) return <div className="p-4 text-center text-white/50">No Friend Requests</div>

  return <div className="p-4">
    {requests.map((friendRequest: FriendshipInitiator) => 
      <RequestComponent key={friendRequest.id} friendRequest={friendRequest} declineAction={handleDecline} acceptAction={handleAccept} isProcessing={isProcessing} />
    )}
  </div>;
}

export default RequestsPage
