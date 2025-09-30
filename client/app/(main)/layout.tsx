import Navbar from "@/components/nav-bar";
import { CacheProvider } from "@/components/providers/cache-provider";
import { AppDataLoader } from "@/components/app-data";
import { Profile } from "@/components/profile";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <AppDataLoader>
        <div className="flex max-h-screen w-screen">
          <aside className="w-80 h-screen flex flex-col gap-2">
            <h3 className="p-4 max-h-16 text-xl flex items-center font-extrabold tracking-widest">Echo</h3>
            <Navbar/>
            <Profile/>
          </aside>
          {children}
        </div>
      </AppDataLoader>
    </CacheProvider>
  );
}

export default MainLayout;
