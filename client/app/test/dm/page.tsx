import { PageTemplate } from "@/components/ui/v2/page-template";
import { Search, UserRound } from "lucide-react";

const HeaderContentComponent = () => (
  <div className="flex gap-3">
    <div className="flex gap-2 items-center">
      <UserRound size={18}/>
      <p className="font-bold">Friends</p>
    </div>
    <p className="text-lg text-white/30">•</p>
    <div className="bg-[#424549] px-3 py-1 rounded-lg cursor-pointer">
      Online
    </div>
    <div className="hover:bg-[#424549]/50 px-3 py-1 rounded-lg cursor-pointer">
      All
    </div>
    <div className="hover:bg-[#7289da]/90 bg-[#5865F2] px-3 py-1 rounded-lg cursor-pointer">
      Add Friend
    </div>
  </div>
);

const MainContentComponent = () => (
  <form className="border border-white/30 bg-[#17171A] px-4 py-3 flex gap-4 items-center rounded-lg">
    <Search size={18}/>
    <input className="focus-within:outline-none w-full" placeholder="Search"/>
  </form>
);

const SidebarContentComponent = () => (
  <div>
    Notifications
  </div>
);


const DirectMessagesPage = () => {
  return (
    <PageTemplate.Main>
      <PageTemplate.Header>
        <HeaderContentComponent/>
      </PageTemplate.Header>
      <PageTemplate.Body>
        <PageTemplate.Content>
          <MainContentComponent/>
        </PageTemplate.Content>
        <PageTemplate.SidePanel>
          <SidebarContentComponent/>
        </PageTemplate.SidePanel>
      </PageTemplate.Body>
    </PageTemplate.Main>
  );
}

export default DirectMessagesPage;
