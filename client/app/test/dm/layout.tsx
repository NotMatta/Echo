import { UserRound } from "lucide-react";
import { PageTemplate } from "@/components/ui/v2/page-template";
import { DmItem } from "@/components/ui/v2/dms/dm-item";
import { ReactNode } from "react";

const DirectMessagesLayout = ({children} : {children: ReactNode}) => {
  return (
    <PageTemplate>
      <PageTemplate.Sidebar>
        <PageTemplate.Title>
          <div className="flex gap-2 items-center">
            <UserRound size={18}/>
            <p className="font-bold">Friends</p>
          </div>
        </PageTemplate.Title>
        <PageTemplate.List>
          <DmItem name="Alice" avatar="https://i.pravatar.cc/150?img=1"/>
          <DmItem name="Bob" avatar="https://i.pravatar.cc/150?img=2"/>
          <DmItem name="Charlie" avatar="https://i.pravatar.cc/150?img=3"/>
          <DmItem name="Diana" avatar="https://i.pravatar.cc/150?img=4"/>
          <DmItem name="Eve" avatar="https://i.pravatar.cc/150?img=5"/>
          <DmItem name="Frank" avatar="https://i.pravatar.cc/150?img=6"/>
          <DmItem name="Grace" avatar="https://i.pravatar.cc/150?img=7"/>
          <DmItem name="Heidi" avatar="https://i.pravatar.cc/150?img=8"/>
          <DmItem name="Ivan" avatar="https://i.pravatar.cc/150?img=9"/>
          <DmItem name="Judy" avatar="https://i.pravatar.cc/150?img=10"/>
        </PageTemplate.List>
      </PageTemplate.Sidebar>
      {children}
    </PageTemplate>
  );
}

export default DirectMessagesLayout;
