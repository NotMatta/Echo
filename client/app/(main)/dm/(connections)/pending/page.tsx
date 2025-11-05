"use client"

import { cancelRequest } from "@/app/actions/friends.action";
import { useAppData } from "@/components/providers/app-data-provider";
import { FriendshipReceiver } from "@/types/friendship";
import { X } from "lucide-react";
import { useState } from "react";


const defaultPfp = "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-4.jpg"

const PendingItem = ({friendRequest, isCanceling, cancelAction} : {friendRequest: FriendshipReceiver, isCanceling: string ,cancelAction: (id: string) => void}) => {

  return (
    <div
      className={`flex group justify-between items-center gap-3 rounded-xl hover:bg-[#242428] cursor-pointer p-3 rounded-t-none hover:rounded-t-lg border-t border-[#242428]`}>
      <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center text-white relative">
        <img src={friendRequest.receiver.pfp || defaultPfp} className="w-full rounded-full h-full object-cover"/>
      </div>
      <p className="text-white font-semibold grow">{friendRequest.receiver.name}</p>
      <button
        disabled={isCanceling === friendRequest.id}
        onClick={() => cancelAction(friendRequest.id)}
        className="flex items-center justify-center p-2 group-hover:bg-[#121214] rounded-full text-red-400/50 hover:text-red-400/80 shrink-0">
        <X size={20}/>
      </button>
    </div>
  );
}

const PendingPage = () => {

  const [isCancelling, setIsCancelling] = useState("");

  const {setPendings, pendings} = useAppData()!;

  const handleCancel = async (id: string) => {
    setIsCancelling(id);
    const res = await cancelRequest(id);
    if(!res.ok) {
      alert(res.message);
    }
    if(res.ok) {
      setPendings((old) => old.filter(fr => fr.id !== id))
      alert("Friend Request Canceled Successfully");
    }
    setIsCancelling("");
  }

  if(pendings.length === 0) return <div className="p-4 text-center text-white/50">No Pending Requests</div>

  return <div className="py-4 flex flex-col gap-3">
    <p className="text-sm text-white/40 font-semibold">Pending - {pendings.length}</p>
    {pendings.map((friendRequest) => (
      <PendingItem key={friendRequest.id} friendRequest={friendRequest} isCanceling={isCancelling} cancelAction={handleCancel}/>
    ))}
  </div>;
}

export default PendingPage
