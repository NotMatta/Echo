"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const path = usePathname();

  return <Link href={href} className={`py-1 px-4 ${path.startsWith(href) ? "border rounded-xl border-white" : "text-white/50 hover:text-white"}`}>{children}</Link>;
}

const FriendsPage = () => {
  return <div className="flex flex-col w-full h-screen">
    <nav className="w-full max-h-16 flex items-center p-4 bg-foreground border-background border-b-2 gap-4">
      <LinkItem href="/">All</LinkItem>
      <LinkItem href="/friends/online">Online</LinkItem>
      <LinkItem href="/friends/requests">Requests</LinkItem>
      <LinkItem href="/friends/blocked">Blocked</LinkItem>
      <button className="bg-primary px-6 py-1 rounded-full font-bold hover:bg-primary/80">Add Friend</button>
    </nav>
    <div className="flex flex-col grow overflow-y-auto bg-foreground">

    </div>
  </div>;
}

export default FriendsPage;
