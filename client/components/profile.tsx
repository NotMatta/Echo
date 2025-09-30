"use client"

import { useCache } from "./providers/cache-provider";

export const Profile = () => {
  const { get } = useCache()!;
  const {data: currentUser} = get("user");
  
  if (!currentUser) {
    return <div className="p-4">Not logged in</div>
  }

  return <div className="flex items-center gap-4 p-4">
    {currentUser.pfp ? <img src={currentUser.pfp} alt={currentUser.name} className=" shrink-0 w-12 h-12 rounded-full object-cover"/> :
      <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">{currentUser.name.charAt(0).toUpperCase()}</div>}
    <div className="flex flex-col grow overflow-hidden">
      <p>{currentUser.name}</p>
      <p>{"#"+currentUser.id.split("-")[0].toUpperCase()}</p>
    </div>
    <div>...</div>
  </div>
}
