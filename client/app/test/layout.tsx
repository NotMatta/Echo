"use client";

import { DmLayout } from "@/components/ui/v2/dms/dm-layout";
import { ProfileComponent } from "@/components/ui/v2/profile-component";
import { ServerItem, ServersLayout } from "@/components/ui/v2/server-components";
import { TopBar } from "@/components/ui/v2/topbar";


const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e2124]">
      <TopBar/>
      <div className="flex w-full h-0 max-h-full grow relative">
        <ServersLayout>
          <ServerItem imgSrc="https://i.pinimg.com/736x/10/98/54/109854f64e01ab941cae240d9afa990c.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
          <ServerItem imgSrc="https://i.pinimg.com/474x/e5/98/e3/e598e36ee7c643d77a02d6356ef8e46f.jpg" />
        </ServersLayout>
        <DmLayout>{children}</DmLayout>
        <ProfileComponent/>
      </div>
    </div>
  );
}

export default MainLayout;
