import { ReactNode } from "react";

interface PropsInterface {
  children: ReactNode;
}

export const PageTemplate = (props: PropsInterface) => (
  <div className="grow border-t border-l border-t-accent border-l-accent h-full rounded-tl-xl flex">
    {props.children}
  </div>
)

const Sidebar = (props: PropsInterface) => (
  <div className="w-72 h-full flex flex-col shrink-0 border-r border-r-accent">
    {props.children}
  </div>
)

const Title = (props: PropsInterface) => (
  <div className="h-12 border-b border-b-accent flex items-center p-4">
    {props.children}
  </div>
)

const List = (props: PropsInterface) => (
  <div className="flex flex-col h-full">
    <div className="flex flex-col h-0 grow max-h-full overflow-y-auto scrollbar scrollbar-w-[2px] scrollbar-thumb-white/40 scrollbar-thumb-rounded-xl p-2">
      {props.children}
    </div>
    <div className="h-[72px]"/>
  </div>
)

const Main = (props: PropsInterface) => (
  <div className="grow h-full bg-[#1A1A1E] flex flex-col">
    {props.children}
  </div>
)

const Header = (props: PropsInterface) => (
  <div className="h-12 border-b border-b-accent flex items-center p-4 gap-3">
    {props.children}
  </div>
)

const Body = (props: PropsInterface) => (
  <div className="flex h-full">
    {props.children}
  </div>
)

const Content = (props: PropsInterface) => (
  <div className="grow max-h-full py-2 px-4">
    {props.children}
  </div>
)

const SidePanel = (props: PropsInterface) => (
  <div className="w-78 shrink-0 bg-[#202024] border-l border-l-accent px-4 py-2">
    {props.children}
  </div>
)

PageTemplate.Sidebar = Sidebar;
PageTemplate.Title = Title;
PageTemplate.List = List;
PageTemplate.Main = Main;
PageTemplate.Header = Header;
PageTemplate.Body = Body;
PageTemplate.Content = Content;
PageTemplate.SidePanel = SidePanel;

export type PageTemplateType = typeof PageTemplate & {
  Sidebar: typeof Sidebar;
  Title: typeof Title;
  List: typeof List;
  Main: typeof Main;
  Header: typeof Header;
  Body: typeof Body;
  Content: typeof Content;
  SidePanel: typeof SidePanel;
};
