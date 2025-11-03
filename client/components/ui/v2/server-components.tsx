import { AudioWaveform } from "lucide-react"

export const ServerItem = ({ imgSrc }: { imgSrc: string }) => {
  return(<div className="flex justify-center items-center h-12 relative group w-full">
    <div className="w-10 h-10 text-white flex items-center justify-center rounded-lg">
      <img src={imgSrc} className="rounded-lg object-cover w-full h-full"/>
    </div>
    <div className="w-0 h-0 rounded-tr-full rounded-br-full absolute left-0 bg-white group-hover:h-4 group-hover:w-1 duration-200"/>
  </div>
  )
}

export const ServersLayout = ({ children }: { children: React.ReactNode }) => {
  return(
    <div className="flex flex-col h-full w-[72px]">
      <div className="w-full grow h-0 max-h-full overflow-y-auto pb-2 flex flex-col gap-1 items-center shrink-0 scrollbar-none">

        {/* Home Button */}
        <div className="flex justify-center items-center h-12 relative w-full">
          <div className="w-10 h-10 bg-[#7289da] text-white flex items-center justify-center rounded-lg">
            <AudioWaveform />
          </div>
          <div className="w-1 h-11 rounded-tr-full rounded-br-full absolute left-0 bg-white"/>
        </div>

        {/* Separator */}
        <div className="w-8 border-b border-b-accent"/>

        {/* Server Items */}
        {children}
      </div>
      <div className="h-[72px]"/>
    </div>
  )
}
