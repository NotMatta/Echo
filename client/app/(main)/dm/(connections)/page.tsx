"use client"

import { Friends } from "@/types/friendship";
import { HeartOff, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { unfriend } from "@/app/actions/friends.action";
import { useAppData } from "@/components/providers/app-data-provider";
import { Search } from "lucide-react"
import { useState } from "react";

const defaultPfp = "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-4.jpg"

const DmItem = ({friend, variant, deleteAction, isDeleting} : {friend: Friends, variant? : "default" | "bordered", deleteAction: (id: string) => void, isDeleting: string}) => {

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dm/${friend.id}`)}
      className={`flex group justify-between items-center gap-3 rounded-xl hover:bg-[#242428] cursor-pointer ${!variant ||variant == "default" ? "p-2" : "p-3 rounded-t-none hover:rounded-t-lg border-t border-[#242428]"}`}>
      <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center text-white relative">
        <img src={friend.pfp || defaultPfp} className="w-full rounded-full h-full object-cover"/>
        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${friend.online ? "bg-green-400" : "bg-gray-500"}`}/>
      </div>
      <p className="text-white font-semibold grow">{friend.name}</p>
      {variant == "bordered" && <button
        className="flex items-center justify-center p-2 group-hover:bg-[#121214] rounded-full text-white/50 hover:text-white/80 shrink-0 cursor-pointer">
        <MessageCircle size={20}/>
      </button>}
      <button
        className="flex items-center justify-center p-2 group-hover:bg-[#121214] rounded-full text-red-400/50 hover:text-red-400/80 shrink-0"
        onClick={async (e) => {
          e.stopPropagation();
          deleteAction(friend.friendshipId);
        }}
        disabled={isDeleting === friend.friendshipId}>
        <HeartOff size={20}/>
      </button>
    </div>
  );
}


const OnlinePage = () => {

  const {friends} = useAppData()!
  const [filter,setFilter] =  useState("")
  const [isUnfriending, setIsUnfriending] = useState("");
  const { setFriends } = useAppData()!;

  const handleDelete = async (id: string) => {
    setIsUnfriending(id);
    const res = await unfriend(id);
    if(!res.ok) {
      alert(res.message);
    } else {
      setFriends((old) => old.filter(f => f.friendshipId !== id));
      alert("Unfriended Successfully");
    }
    setIsUnfriending("");
  }

  return(
    <div className="w-full h-0 grow max-h-full flex flex-col gap-2 overflow-y-auto">
      <div  className="sticky top-0 w-full pb-3 bg-[#1A1A1E]">
        <form className="border border-white/30 bg-[#17171A] px-4 py-3 flex gap-4 items-center rounded-lg">
          <Search size={18}/>
          <input className="focus-within:outline-none w-full" placeholder="Search" onChange={(e) => setFilter(e.target.value)}/>
        </form>
      </div>
      <p className="text-sm text-white/40 font-semibold">Online - {friends.filter((friend: Friends) => friend.online).length}</p>
      {friends.filter((friend: Friends) => friend.online && friend.name.includes(filter)).map((friend: Friends) =>
        <DmItem key={`friends-${friend.id}`} friend={friend} variant="bordered" deleteAction={handleDelete} isDeleting={isUnfriending}/>
      )}
    </div>
  )
}

export default OnlinePage
