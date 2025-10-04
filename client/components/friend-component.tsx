"use client"

import { FriendWithId } from "./hooks/useFriendships"

export const FriendComponent = (props : {friend: FriendWithId, deleteAction: (id: string) => void, isDeleting: string} ) => {
  return(
    <div className="group p-4 border-b border-background flex justify-between items-center">
      <div className="flex items-center gap-4">
        {props.friend.pfp ? <img src={props.friend.pfp} alt={props.friend.name} className="w-10 h-10 rounded-full object-cover"/> :
          <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">{props.friend.name.charAt(0).toUpperCase()}</div>}
        <div className="flex flex-col grow">
          <p className="font-bold">{props.friend.name}</p>
        </div>
      </div>
      <button className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700 opacity-0 group-hover:opacity-100 disabled:opacity-50" onClick={() => props.deleteAction(props.friend.friendshipId)} disabled={props.isDeleting == props.friend.friendshipId}>Remove Friend</button>
    </div>
  )
}
