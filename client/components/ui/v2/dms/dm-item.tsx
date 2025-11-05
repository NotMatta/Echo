"use client"

import { Friends } from "@/types/friendship";
import { useRouter } from "next/navigation";


const defaultPfp = "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-4.jpg"

export const DmItem = ({friend, variant} : {friend: Friends, variant? : "default" | "bordered"}) => {

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dm/${friend.id}`)}
      className={`flex items-center gap-3 rounded-xl hover:bg-[#242428] cursor-pointer ${!variant ||variant == "default" ? "p-2" : "p-3 rounded-t-none hover:rounded-t-lg border-t border-[#242428]"}`}>
      <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center text-white relative">
        <img src={friend.pfp || defaultPfp} className="w-full rounded-full h-full object-cover"/>
        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${friend.online ? "bg-green-400" : "bg-gray-500"}`}/>
      </div>
      <p className="text-white font-semibold">{friend.name}</p>
    </div>
  );
}
