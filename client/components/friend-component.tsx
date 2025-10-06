"use client"

import { Friends } from "@/types/friendship"
import { useRouter } from "next/navigation"

export const FriendComponent = (props : {friend: Friends, deleteAction: (id: string) => void, isDeleting: string} ) => {
  const router = useRouter();
  return(
    <div className="group p-4 border-b border-background flex justify-between items-center" onClick={() => router.push(`/friends/${props.friend.id}`)}>
      <div className="flex items-center gap-4 relative">
        {props.friend.pfp ? <img src={props.friend.pfp} alt={props.friend.name} className="w-10 h-10 rounded-full object-cover"/> :
          <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">{props.friend.name.charAt(0).toUpperCase()}</div>}
        <div className="flex flex-col grow">
          <p className="font-bold">{props.friend.name}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${props.friend.online ? 'bg-green-500' : 'bg-gray-500'} absolute top-0 left-7 border-2 border-background`}></div>
      </div>
      <button className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700 opacity-0 group-hover:opacity-100 disabled:opacity-50" onClick={() => props.deleteAction(props.friend.friendshipId)} disabled={props.isDeleting == props.friend.friendshipId}>Remove Friend</button>
    </div>
  )
}
