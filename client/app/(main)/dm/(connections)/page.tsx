"use client"

import { useAppData } from "@/components/providers/app-data-provider";
import { DmItem } from "@/components/ui/v2/dms/dm-item";
import { Friends } from "@/types/friendship";
import { Search } from "lucide-react"
import { useState } from "react";

const OnlinePage = () => {

  const {friends} = useAppData()!
  const [filter,setFilter] =  useState("")

  return(
    <div className="w-full h-0 grow max-h-full flex flex-col gap-2 overflow-y-auto">
      <div  className="sticky top-0 w-full pb-3 bg-[#1A1A1E]">
        <form className="border border-white/30 bg-[#17171A] px-4 py-3 flex gap-4 items-center rounded-lg">
          <Search size={18}/>
          <input className="focus-within:outline-none w-full" placeholder="Search" onChange={(e) => setFilter(e.target.value)}/>
        </form>
      </div>
      <p className="text-sm text-white/40 font-semibold">Online - {friends.filter((friend: Friends) => friend.online).length}</p>
      {friends.filter((friend: Friends) => friend.online && friend.name.includes(filter)).map((friend: Friends) => <DmItem key={`friends-${friend.id}`} friend={friend} variant="bordered"/>)}
    </div>
  )
}

export default OnlinePage
