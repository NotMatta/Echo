"use client"

import { PageTemplate } from "@/components/ui/v2/page-template";
import { UserRound } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppData } from "@/components/providers/app-data-provider";

const LinkItem = ({ href, count, children }: { href: string, count: number, children: React.ReactNode }) => {
  const path = usePathname();

  return <Link href={href} className={`py-1 px-3 relative rounded-lg ${path == href ? "bg-[#424549]" : "text-white/50 hover:bg-[#424549]/50"}`}>
    {count > 0 && <div className="bg-red-500 text-xs absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-white">{count}</div>}
    {children}
  </Link>;
}

const Layout = ({children} : {children: ReactNode}) => {

  const path = usePathname();
  const {requests, pendings} = useAppData()!

  return(
    <PageTemplate.Main>
      <PageTemplate.Header>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center">
            <UserRound size={18}/>
            <p className="font-bold">Friends</p>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/30"/>
          <LinkItem href="/dm" count={0}>Online</LinkItem>
          <LinkItem href="/dm/all" count={0}>All</LinkItem>
          <Link href="/dm/add" className={`px-3 py-1 rounded-lg cursor-pointer ${path == "/dm/add" ? "bg-[#242640] text-[#778AF2]":  "hover:bg-[#7289da]/90 bg-[#5865F2]"}`}>
            Add Friend
          </Link>
          {pendings.length > 0 && <LinkItem href="/dm/pending" count={pendings.length}>Pending</LinkItem>}
          {requests.length > 0 && <LinkItem href="/dm/requests" count={requests.length}>Requests</LinkItem>}
        </div>
      </PageTemplate.Header>
      <PageTemplate.Body>
        <PageTemplate.Content>
        {children}
        </PageTemplate.Content>
        <PageTemplate.SidePanel>
          Notifications
        </PageTemplate.SidePanel>
      </PageTemplate.Body>
    </PageTemplate.Main>
  )
}

export default Layout
