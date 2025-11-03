"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { addFriend } from "@/app/actions/friends.action";
import { useAppData } from "@/components/providers/app-data-provider";
import { ActionResponse } from "@/types/action-response";
import { useNotification } from "@/components/providers/notification-provider";

const LinkItem = ({ href, count, children }: { href: string, count: number, children: React.ReactNode }) => {
  const path = usePathname();

  return <Link href={href} className={`py-1 px-4 relative ${path == href ? "border rounded-xl border-white" : "text-white/50 hover:text-white"}`}>
    {count > 0 && <div className="bg-red-500 text-xs absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-white">{count}</div>}
    {children}
  </Link>;
}

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
  const path = usePathname();
  const { requests } = useAppData()!;

  if(path.startsWith("/friends/dm")){
    return <div className="flex flex-col w-full h-screen bg-foreground">
      {children}
    </div>;
  }

  return <div className="flex flex-col w-full h-screen">
    <nav className="w-full max-h-16 flex items-center p-4 bg-foreground border-background border-b-2 gap-4">
      <LinkItem href="/friends" count={0}>Online</LinkItem>
      <LinkItem href="/friends/requests" count={requests.length}>Requests</LinkItem>
      <LinkItem href="/friends/pending" count={0}>Pending</LinkItem>
      <LinkItem href="/friends/blocked" count={0}>Blocked</LinkItem>
      <AddFriendButton/>
    </nav>
    <div className="flex flex-col grow overflow-y-auto bg-foreground">
      {children}
    </div>
  </div>;
}

export default FriendsLayout;
