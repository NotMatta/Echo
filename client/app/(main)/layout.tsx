"use client";

import Link from "next/link";
import { AtSign, CircleQuestionMark, Settings, UsersRound, Waypoints } from "lucide-react";
import { usePathname } from "next/navigation";

const NavElement = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const path = usePathname();
  return (
    <Link href={href} className={`px-4 py-8  font-bold flex gap-4 items-center ${path.startsWith(href) ? "bg-primary/10 text-primary border-l-6 border-l-primary" : "hover:text-primary"}`}>
      {children}
    </Link>
  );
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex max-h-screen w-screen">
      <aside className="w-80 h-screen flex flex-col gap-2">
        <h3 className="p-4 max-h-16 text-xl flex items-center font-extrabold tracking-widest">Echo</h3>
        <nav className="flex flex-col grow">
          <NavElement href="/friends"><UsersRound />Friends</NavElement>
          <NavElement href="/chat"><Waypoints /> Groups</NavElement>
          <NavElement href="/settings"><Settings/> Settings</NavElement>
          <NavElement href="/profile"><AtSign/> Mentions</NavElement>
          <NavElement href="/help"><CircleQuestionMark/>Help</NavElement>
        </nav>
        <div className="flex items-center gap-4 p-4">
          <img src="https://i.pinimg.com/736x/1d/f0/62/1df062d91f8d48e925820a18010ec0d1.jpg" alt="User Avatar" className="w-12 h-12 rounded-full"/>
          <div>
            <p>Jane Doe</p>
            <p>#janedoe</p>
          </div>
          <div>...</div>
        </div>
      </aside>
      {children}
    </div>
  );
}

export default MainLayout;
