"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { addFriend } from "@/app/actions/friends.action";
import { useAppData } from "@/components/providers/app-data-provider";
import { ActionResponse } from "@/types/action-response";
import { Friendships } from "@/components/providers/app-data-provider";

const LinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const path = usePathname();

  return <Link href={href} className={`py-1 px-4 ${path == href ? "border rounded-xl border-white" : "text-white/50 hover:text-white"}`}>{children}</Link>;
}

const AddFriendButton = () => {

  const [toggle,setTooggle] = useState(false);
  const { mutateFriendships } = useAppData();
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
      mutateFriendships((old: Friendships) => {
        console.log("Old friendships:", old);
        return {
          ...old,
          sent: [
            ...old.sent,
            res.data
          ]
        };
      });
      setName("");
      setTooggle(false);
    }
    setResponse(res);
    setLoading(false);
  }

  return(
    <div>
      <button className="bg-primary px-6 py-1 rounded-full font-bold hover:bg-primary/80"
      onClick={() => { setResponse(null); setName(""); setTooggle(true)}}
      >Add Friend</button>
      {toggle && <div className="absolute w-screen h-screen top-0 left-0 flex justify-center items-center" >
        <div className="w-full h-full bg-black/50 absolute top-0 left-0" onClick={() => setTooggle(false)}/>
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

const FriendsLayout = ({children}: {children: React.ReactNode}) => {
  return <div className="flex flex-col w-full h-screen">
    <nav className="w-full max-h-16 flex items-center p-4 bg-foreground border-background border-b-2 gap-4">
      <LinkItem href="/friends">Online</LinkItem>
      <LinkItem href="/friends/requests">Requests</LinkItem>
      <LinkItem href="/friends/pending">Pending</LinkItem>
      <LinkItem href="/friends/blocked">Blocked</LinkItem>
      <AddFriendButton/>
    </nav>
    <div className="flex flex-col grow overflow-y-auto bg-foreground">
      {children}
    </div>
  </div>;
}

export default FriendsLayout;
