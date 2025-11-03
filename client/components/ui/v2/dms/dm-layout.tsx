export const DmItem = ({ name, avatar }: { name: string; avatar: string }) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#2a2d31] cursor-pointer">
      <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center text-white">
        <img src={avatar} className="w-full rounded-full h-full object-cover"/>
      </div>
      <p className="text-white font-semibold">{name}</p>
    </div>
  );
}

export const DmLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grow border-t border-l border-t-accent border-l-accent h-full rounded-tl-xl flex">
      <div className="w-72 h-full flex flex-col shrink-0 border-r border-r-accent">
        <div className="h-11 border-b border-b-accent flex items-center p-4">
          <p>Direct Messages</p>
        </div>

        {/* Direct Messages List */}
        <div className="flex flex-col h-full">
          <div className="flex flex-col h-0 grow max-h-full overflow-y-auto scrollbar scrollbar-w-[2px] scrollbar-thumb-white/40 scrollbar-thumb-rounded-xl p-2">

            {/* Direct Message Item Template */}
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />
            <DmItem name="Alice" avatar="https://i.pinimg.com/474x/95/43/e1/9543e1ded7075fca932ddeb8079ba8dc.jpg" />

          </div>
          <div className="h-[72px]"/>
        </div>
      </div>
      {children}
    </div>
  );
}
