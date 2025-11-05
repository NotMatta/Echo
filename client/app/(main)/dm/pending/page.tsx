"use client";
import { PendingComponent } from "@/components/pending-component";
import { useState } from "react";
import { useAppData } from "@/components/providers/app-data-provider";
import { cancelRequest } from "@/app/actions/friends.action";

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

  return <div className="p-4">
    {pendings.map((friendRequest) => (
      <PendingComponent key={friendRequest.id} friendRequest={friendRequest} isCanceling={isCancelling} cancelAction={handleCancel}/>
    ))}
  </div>;
}

export default PendingPage
