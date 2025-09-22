"use client";
import { Friendship } from "@/generated/prisma";
import { acceptRequest, declineRequest } from "@/app/(main)/friends/friends";

interface FriendshipProps extends Friendship {
  initiator: {
    id: string;
    name: string;
    pfp: string | null;
  }
}

export const RequestComponent = (props: {friendRequest: FriendshipProps}) => {
  return <div className="p-4 border-b border-background flex justify-between items-center">
    <div className="flex items-center gap-4">
      {props.friendRequest.initiator.pfp ? <img src={props.friendRequest.initiator.pfp} alt={props.friendRequest.initiator.name} className="w-10 h-10 rounded-full object-cover"/> :
      <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">{props.friendRequest.initiator.name.charAt(0).toUpperCase()}</div>}
      <div className="flex flex-col">
        <p className="font-bold">{props.friendRequest.initiator.name}</p>
        <p className="text-sm text-white/50">Friend Request Recieved at {new Date(props.friendRequest.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-700" onClick={() => acceptRequest(props.friendRequest.id)}>Accept</button>
      <button className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700" onClick={() => declineRequest(props.friendRequest.id)}>Decline</button>
    </div>
  </div>;
}
