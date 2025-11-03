import { Search, UserRound } from "lucide-react";

const DirectMessagesPage = () => {
  return(
    <div className="grow h-full bg-[#282b30] flex flex-col">
      <div className="h-11 border-b border-b-accent flex items-center p-4 gap-3">
        <div className="flex gap-2 items-center">
          <UserRound size={18}/>
          <p className="font-bold">Friends</p>
        </div>
        <p className="text-xs text-white/30">•</p>
        <div className="bg-[#424549] px-3 py-1 rounded-lg cursor-pointer">
          Online
        </div>
        <div className="hover:bg-[#424549]/50 px-3 py-1 rounded-lg cursor-pointer">
          All
        </div>
        <div className="hover:bg-[#7289da]/90 bg-[#7289da] px-3 py-1 rounded-lg cursor-pointer">
          Add Friend
        </div>
      </div>
      <div className="flex h-full">
        <div className="grow max-h-full py-2 px-4">
          <form className="border border-white/30 bg-[#1e2124]/80 px-4 py-3 flex gap-4 items-center rounded-lg">
            <Search size={18}/>
            <input className="focus-within:outline-none w-full" placeholder="Search"/>
          </form>
        </div>
        <div className="w-78 shrink-0 bg-[#36393e] px-4 py-2">
          Notifications
        </div>
      </div>
    </div>
  );
}

export default DirectMessagesPage;
