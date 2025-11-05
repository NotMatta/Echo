"use client"

import { useAppData } from "@/components/providers/app-data-provider";
import { Settings } from "lucide-react"

const defaultPfp = "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-4.jpg"

export const ProfileComponent = () => {

  const {currentUser} = useAppData()!;;

  return (
    <div className="bg-[#121214] h-[72px] w-[360px] absolute left-0 bottom-0 px-2 pb-2">
      <div className="w-full h-full bg-[#333338] rounded-xl flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2 hover:bg-white/5 rounded-lg cursor-pointerp px-2 py-1 grow">
          <img src={currentUser?.pfp || defaultPfp} className="w-10 h-10 object-cover rounded-full"/>
          <div className="flex flex-col">
            <p className="text-sm font-bold">{currentUser?.name}</p>
            <p className="text-xs font-semibold text-white/80">Online</p>
          </div>
        </div>
        <button className="hover:bg-white/5 p-2 rounded-lg cursor-pointer"><Settings/></button>
      </div>
    </div>
  )
}
