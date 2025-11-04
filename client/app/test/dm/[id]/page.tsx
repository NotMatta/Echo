"use client"

import { PageTemplate } from "@/components/ui/v2/page-template";
import { Forward } from "lucide-react";
import { useState } from "react";

const DirectMessagesPage = () => {

  const [input, setInput] = useState("");

  return(
    <PageTemplate.Main>
      <PageTemplate.Header>
        Someone
      </PageTemplate.Header>
      <PageTemplate.Body>
        <PageTemplate.Content>
          <div className="flex flex-col gap-2 h-full max-h-full w-full">
            <div className="grow h-0 max-h-full overflow-y-auto">
              Dui te mpus, est vestibulum, vitae.
            </div>
            <form  className="flex p-4 border border-accent bg-[#36393e] text-white w-full rounded-xl placeholder:text-white/30">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="focus:outline-none w-full"
                placeholder="Type a message..." />
              <button className="text-white/30"><Forward /></button>
            </form>
          </div>
        </PageTemplate.Content>
        <PageTemplate.SidePanel>
          Tempor convallis purus ut ut malesuada eget finibus ante, pellentesque.
        </PageTemplate.SidePanel>
      </PageTemplate.Body>
    </PageTemplate.Main>
  )
}

export default DirectMessagesPage;
