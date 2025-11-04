"use client";

import { ProfileComponent } from "@/components/ui/v2/profile-component";
import { ServerItem, ServersLayout } from "@/components/ui/v2/server-components";
import { TopBar } from "@/components/ui/v2/topbar";


const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#121214]">
      <TopBar/>
      <div className="flex w-full h-0 max-h-full grow relative">
        <ServersLayout>
          <ServerItem imgSrc="https://i.pinimg.com/736x/10/98/54/109854f64e01ab941cae240d9afa990c.jpg" />
        </ServersLayout>
        {children}
        <ProfileComponent/>
      </div>
    </div>
  );
}

export default MainLayout;
