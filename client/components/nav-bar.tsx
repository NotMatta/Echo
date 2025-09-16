"use client";

import Link from "next/link";
import { AtSign, CircleQuestionMark, Settings, UsersRound, Waypoints, Lock } from "lucide-react";
import { usePathname } from "next/navigation";

const NavElement = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const path = usePathname();
  return (
    <Link href={href} className={`px-4 py-8  font-bold flex gap-4 items-center ${path.startsWith(href) ? "bg-primary/10 text-primary border-l-6 border-l-primary" : "hover:text-primary"}`}>
      {children}
    </Link>
  );
}

const Navbar = () => {
  return (
    <nav className="flex flex-col grow">
      <NavElement href="/friends"><UsersRound />Friends</NavElement>
      <NavElement href="/chat"><Waypoints /> Groups</NavElement>
      <NavElement href="/settings"><Settings/> Settings</NavElement>
      <NavElement href="/profile"><AtSign/> Mentions</NavElement>
      <NavElement href="/help"><CircleQuestionMark/>Help</NavElement>
      <NavElement href="/auth"><Lock/>Test Auth</NavElement>
    </nav>
  )
};

export default Navbar;
