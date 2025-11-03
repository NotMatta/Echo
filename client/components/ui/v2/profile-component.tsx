import { Settings } from "lucide-react"

export const ProfileComponent = () => {
  return (
    <div className="bg-[#1e2124] h-[72px] w-[360px] absolute left-0 bottom-0 px-2 pb-2">
      <div className="w-full h-full bg-[#36393e] rounded-xl flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2 hover:bg-white/5 rounded-lg cursor-pointerp px-2 py-1 grow">
          <img src="https://i.pinimg.com/736x/ca/b4/d0/cab4d0de2af6f70e87b5b42a7c85ec18.jpg" className="w-10 h-10 object-cover rounded-full"/>
          <div className="flex flex-col">
            <p className="text-sm font-bold">Username</p>
            <p className="text-xs font-semibold text-white/80">Status</p>
          </div>
        </div>
        <button className="hover:bg-white/5 p-2 rounded-lg cursor-pointer"><Settings/></button>
      </div>
    </div>
  )
}
