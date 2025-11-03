import { UserRound } from "lucide-react"

export const TopBar = () => {
  return(
    <div className="h-10 flex gap-2 items-center justify-center">
      <UserRound size={18}/>
      <p>Friends</p>
    </div>
  )
}
