import { CacheProvider } from "@/components/providers/cache-provider";
import { AppDataProvider } from "@/components/providers/app-data-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { SocketListener } from "@/components/socket-listener";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { TopBar } from "@/components/ui/v2/topbar";
import { ServerItem, ServersLayout } from "@/components/ui/v2/server-components";
import { ProfileComponent } from "@/components/ui/v2/profile-component";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <AppDataProvider>
        <NotificationProvider>
          <SocketProvider>
            <SocketListener />
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
          </SocketProvider>
        </NotificationProvider>
      </AppDataProvider>
    </CacheProvider>
  );
}

export default MainLayout;
