"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { addFriend } from "@/app/actions/friends.action";
import { useAppData } from "@/components/providers/app-data-provider";
import { ActionResponse } from "@/types/action-response";
import { PageTemplate } from "@/components/ui/v2/page-template";
import { Friends } from "@/types/friendship";
import { DmItem } from "@/components/ui/v2/dms/dm-item";

const LinkItem = ({ href, count, children }: { href: string, count: number, children: React.ReactNode }) => {
  const path = usePathname();

  return <Link href={href} className={`py-1 px-4 relative ${path == href ? "border rounded-xl border-white" : "text-white/50 hover:text-white"}`}>
    {count > 0 && <div className="bg-red-500 text-xs absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-white">{count}</div>}
    {children}
  </Link>;
}


const FriendsLayout = ({children}: {children: React.ReactNode}) => {
  const path = usePathname();
  const {friends} = useAppData()!;

  if(path.startsWith("/friends/dm")){
    return <div className="flex flex-col w-full h-screen bg-foreground">
      {children}
    </div>;
  }

  return (
    <PageTemplate>
      <PageTemplate.Sidebar>
        <PageTemplate.Title>
          Direct Messages
        </PageTemplate.Title>
        <PageTemplate.List>
          {friends.map((friend: Friends) => <DmItem key={`friends-${friend.id}`} friend={friend}/>)}
        </PageTemplate.List>
      </PageTemplate.Sidebar>
      {children}
    </PageTemplate>
  );
}

export default FriendsLayout;
