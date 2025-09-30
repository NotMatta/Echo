"use client";
import { LoaderCircle } from "lucide-react";
import { FriendshipReceiver } from "@/types/friendship";

export const PendingComponent = (props: {friendRequest: FriendshipReceiver, isCanceling: boolean, cancelAction: (id: string) => void}) => {

  return <div className="p-4 border-b border-background flex justify-between items-center">
    <div className="flex items-center gap-4">
      {props.friendRequest.receiver.pfp ? <img src={props.friendRequest.receiver.pfp} alt={props.friendRequest.receiver.name} className="w-10 h-10 rounded-full object-cover"/> :
      <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">{props.friendRequest.receiver.name.charAt(0).toUpperCase()}</div>}
      <div className="flex flex-col">
        <p className="font-bold">{props.friendRequest.receiver.name}</p>
        <p className="text-sm text-white/50">Friend Request Sent at {new Date(props.friendRequest.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700" disabled={props.isCanceling} onClick={() => props.cancelAction(props.friendRequest.id)}>
        {props.isCanceling ? <LoaderCircle className="animate-spin"/> : "Cancel"}
      </button>
    </div>
  </div>;
}
