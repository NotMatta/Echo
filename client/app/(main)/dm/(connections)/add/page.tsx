"use client"
import { addFriend } from "@/app/actions/friends.action";
import { useState } from "react";
import { useAppData } from "@/components/providers/app-data-provider";
import { ActionResponse } from "@/types/action-response";
const AddPage = () => {

  const [name,setName] = useState("")
  const { setPendings } = useAppData()!;
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
    }
    setResponse(res);
    setLoading(false);
  }

  return(
    <div className="flex flex-col gap-3 py-3">
      <h3 className="text-xl font-bold">Add Friend</h3>
      <p className="text-md">You can add friends using their username</p>
      <form
        className={`p-3 bg-[#1E1F22] rounded-lg gap-4 border ${response && !response.ok ? "border-red-400/50" : "border-transparent focus-within:border-[#5197ED]"} flex justify-between`}
        onSubmit={async (e) => {e.preventDefault(); await handleSendRequest();}}>
        <input placeholder="You can add friends using their username" className="grow focus-within:outline-none" value={name} onChange={(e) => {setName(e.target.value); setResponse(null)}}/>
        <button className="bg-[#5865EB] p-2 rounded-lg cursor-pointer disabled:opacity-40" disabled={!name || loading}>Send Friend Request</button>
      </form>
      <p className={`text-sm ${response?.ok ? "text-green-400/50" : "text-red-400/50"}`}>{response?.message}</p>
    </div>
  )
}

export default AddPage
