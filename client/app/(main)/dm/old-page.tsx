"use client"

import { addFriend, unfriend } from "@/app/actions/friends.action";
import { useState } from "react";
import { useAppData } from "@/components/providers/app-data-provider";
import { PageTemplate } from "@/components/ui/v2/page-template";
import { UserRound } from "lucide-react";
import { ActionResponse } from "@/types/action-response";

const AddFriendButton = () => {

  const [toggle,setTooggle] = useState(false);
  const { setPendings } = useAppData()!;
  const [name,setName] = useState("")
  const [response,setResponse] = useState<ActionResponse | null>(null);
  const [loading,setLoading] = useState(false);

  const handleSendRequest = async () => {
    if(name.length === 0){
      setResponse({ok: false, message: "Username cannot be empty"})
      return;
    };
    setLoading(true);
    const res = await addFriend(name);
    if(res.ok){
      setPendings((old) => {
        return [...old, res.data];   
      })
      setName("");
      setTooggle(false);
    }
    setResponse(res);
    setLoading(false);
  }

  return(
    <div>
      <button className="hover:bg-[#7289da]/90 bg-[#5865F2] px-3 py-1 rounded-lg cursor-pointer"
      onClick={() => { setResponse(null); setName(""); setTooggle(true)}}
      >Add Friend</button>
      {toggle && <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center" >
        <div className="w-full h-full bg-black/50 absolute bottom-0 left-0" onClick={() => setTooggle(false)}/>
        <div className="bg-foreground z-30 rounded-lg w-[600px] shadow flex p-4">
          <div className="flex flex-col grow mr-4 relative py-1">
            <input value={name} onChange={e => setName(e.target.value)} onKeyUp={e => {e.key == "Enter" ? handleSendRequest() : ""}} type="text" name="username" placeholder="Type Username" className="p-2 grow bg-transparent focus-within:outline-none"/>
            {response && <p className={`font-bold text-xs text-center absolute -bottom-2 w-full ${response.ok ? "text-green-500" : "text-red-500"}`}>{response.message}</p>}
          </div>
          <button className="bg-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/80 disabled:opacity-50" disabled={loading} onClick={handleSendRequest}>Send Friend Request</button>
        </div>
      </div>}
    </div>
  )

}

const FriendsPage = () => {

  const [isUnfriending, setIsUnfriending] = useState("");
  const {friends, setFriends} = useAppData()!;

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

  return (
  <PageTemplate.Main>
      <PageTemplate.Header>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center">
            <UserRound size={18}/>
            <p className="font-bold">Friends</p>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/30"/>
          <div className="bg-[#424549] px-3 py-1 rounded-lg cursor-pointer">
            Online
          </div>
          <div className="hover:bg-[#424549]/50 px-3 py-1 rounded-lg cursor-pointer">
            All
          </div>
          <AddFriendButton/>
        </div>
      </PageTemplate.Header>
  </PageTemplate.Main>
  )
}

export default FriendsPage
