"use client"

import { removeFriend } from "@/app/(main)/friends/friends"

export const FriendComponent = ({friend} : {friend: {id: string, name: string, pfp: string | null}}) => {
  return(
    <div className="group p-4 border-b border-background flex justify-between items-center">
      <div className="flex items-center gap-4">
        {friend.pfp ? <img src={friend.pfp} alt={friend.name} className="w-10 h-10 rounded-full object-cover"/> :
          <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">{friend.name.charAt(0).toUpperCase()}</div>}
        <div className="flex flex-col">
          <p className="font-bold">{friend.name}</p>
        </div>
        <button className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700 opacity-0 group-hover:opacity-100" onClick={() => removeFriend(friend.id)}>Remove Friend</button>
      </div>
    </div>
  )
}
