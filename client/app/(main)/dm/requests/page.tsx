"use client"
import { RequestComponent } from "@/components/request-component";
import { FriendshipInitiator } from "@/types/friendship";
import { useAppData } from "@/components/providers/app-data-provider";
import { acceptRequest, declineRequest } from "@/app/actions/friends.action";
import { useState } from "react";

const RequestsPage = () => {

  const {setRequests, requests, setFriends} = useAppData()!;
  const [isProcessing, setIsProcessing] = useState("");

  const handleAccept = async (id: string) => {
    setIsProcessing(id);
    const res = await acceptRequest(id);
    if(!res.ok) {
      alert(res.message);
    }
    if(res.ok) {
      const friendrequest = requests.find(req => req.id == id)!;
      setRequests((old) => old.filter(fr => fr.id !== id));
      setFriends((old) => [...old, {
        id: friendrequest.initiator.id,
        name: friendrequest.initiator.name,
        email: friendrequest.initiator.email,
        pfp: friendrequest.initiator.pfp,
        online: false,
        friendshipId: id
      }]);
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
      setRequests((old) => old.filter(fr => fr.id !== id));
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
