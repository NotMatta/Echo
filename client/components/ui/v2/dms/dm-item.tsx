export const DmItem = ({ name, avatar }: { name: string; avatar: string }) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1D1D1E] cursor-pointer">
      <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center text-white">
        <img src={avatar} className="w-full rounded-full h-full object-cover"/>
      </div>
      <p className="text-white font-semibold">{name}</p>
    </div>
  );
}
