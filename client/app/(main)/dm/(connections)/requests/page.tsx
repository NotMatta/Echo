"use client"

import { acceptRequest ,declineRequest } from "@/app/actions/friends.action";
import { useAppData } from "@/components/providers/app-data-provider";
import { FriendshipInitiator } from "@/types/friendship";
import { Check, X } from "lucide-react";
import { useState } from "react";


const defaultPfp = "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-4.jpg"

const RequestItem = ({friendRequest, isProcessing, acceptAction, declineAction} : {
  friendRequest: FriendshipInitiator,
  isProcessing: string,
  acceptAction: (id: string) => void,
  declineAction: (id: string) => void
}) => {
  return (
    <div
      className={`flex group justify-between items-center gap-3 rounded-xl hover:bg-[#242428] cursor-pointer p-3 rounded-t-none hover:rounded-t-lg border-t border-[#242428]`}>
      <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center text-white relative">
        <img src={friendRequest.initiator.pfp || defaultPfp} className="w-full rounded-full h-full object-cover"/>
      </div>
      <p className="text-white font-semibold grow">{friendRequest.initiator.name}</p>
      <button
        disabled={isProcessing === friendRequest.id}
        onClick={() => acceptAction(friendRequest.id)}
        className="flex items-center justify-center p-2 group-hover:bg-[#121214] rounded-full text-green-400/50 hover:text-green-400/80 shrink-0">
        <Check size={20}/>
      </button>
      <button
        disabled={isProcessing === friendRequest.id}
        onClick={() => declineAction(friendRequest.id)}
        className="flex items-center justify-center p-2 group-hover:bg-[#121214] rounded-full text-red-400/50 hover:text-red-400/80 shrink-0">
        <X size={20}/>
      </button>
    </div>
  );
}

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
        online: res.data.initiator.online,
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

  return <div className="py-4 flex flex-col gap-3">
    <p className="text-sm text-white/40 font-semibold">Requests - {requests.length}</p>
    {requests.map((friendRequest) => (
      <RequestItem key={friendRequest.id} friendRequest={friendRequest} declineAction={handleDecline} acceptAction={handleAccept} isProcessing={isProcessing} />
    ))}
  </div>;
}

export default RequestsPage
