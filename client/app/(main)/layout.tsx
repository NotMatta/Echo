import Navbar from "@/components/nav-bar";
import { CacheProvider } from "@/components/providers/cache-provider";
import { getCurrentUser } from "../actions/auth.actions";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  
  const {user : currentUser} = await getCurrentUser();

  if (!currentUser) {
    return <div>Please log in to access this page.</div>;
  }


  return (
    <CacheProvider>
      <div className="flex max-h-screen w-screen">
        <aside className="w-80 h-screen flex flex-col gap-2">
          <h3 className="p-4 max-h-16 text-xl flex items-center font-extrabold tracking-widest">Echo</h3>
          <Navbar/>
          <div className="flex items-center gap-4 p-4">
            {currentUser.pfp ? <img src={currentUser.pfp} alt={currentUser.name} className=" shrink-0 w-12 h-12 rounded-full object-cover"/> :
            <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">{currentUser.name.charAt(0).toUpperCase()}</div>}
            <div className="flex flex-col grow overflow-hidden">
              <p>{currentUser.name}</p>
              <p>{"#"+currentUser.id.split("-")[0].toUpperCase()}</p>
            </div>
            <div>...</div>
          </div>
        </aside>
        {children}
      </div>
    </CacheProvider>
  );
}

export default MainLayout;
