"use client";
import { usePathname } from "next/navigation";
import { useAppData } from "@/components/providers/app-data-provider";
import { PageTemplate } from "@/components/ui/v2/page-template";
import { Friends } from "@/types/friendship";
import { DmItem } from "@/components/ui/v2/dms/dm-item";

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
