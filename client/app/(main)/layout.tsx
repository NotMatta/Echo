import Navbar from "@/components/nav-bar";
import { CacheProvider } from "@/components/providers/cache-provider";
import { AppDataProvider } from "@/components/providers/app-data-provider";
import { Profile } from "@/components/profile";
import { SocketProvider } from "@/components/providers/socket-provider";
import { SocketListener } from "@/components/socket-listener";
import { NotificationProvider } from "@/components/providers/notification-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <AppDataProvider>
        <NotificationProvider>
          <SocketProvider>
            <SocketListener />
            <div className="flex max-h-screen w-screen">
              <aside className="w-80 h-screen max-f-full flex flex-col gap-2">
                <h3 className="p-4 max-h-16 text-xl flex items-center font-extrabold tracking-widest">Echo</h3>
                <Navbar/>
                <Profile/>
              </aside>
              {children}
            </div>
          </SocketProvider>
        </NotificationProvider>
      </AppDataProvider>
    </CacheProvider>
  );
}

export default MainLayout;
