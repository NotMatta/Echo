"use client";

import { useAppData } from "@/components/providers/app-data-provider";
import { updateUser } from "@/app/actions/users.action";
import { useState } from "react";

const Input = ({label,value,onChange}:{label:string,value:string,onChange:(val:string)=>void}) => (
  <div className="mb-4">
    <label className="text-sm font-medium">{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 block w-full border border-white/20 focus-within:outline-none rounded-md shadow-sm p-2" />
  </div>  
)

const SettingsPage = () => {
  const { currentUser, setCurrentUser } = useAppData()!;
  const [name,setName] = useState(currentUser?.name || "");
  const [email,setEmail] = useState(currentUser?.email || "");
  const [pfp,setPfp] = useState(currentUser?.pfp || "");

  const handleReset = () => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setPfp(currentUser?.pfp || "");
  }

  const handleSaveChanges = async () => {
    const res = await updateUser(name, email, pfp);
    if(res.ok){
      alert("User updated successfully");
      setCurrentUser(res.data);
    } else {
      alert(`Error updating user: ${res.message}`);
      handleReset();
    }
  }


  return(
    <div className="bg-accent w-full p-4">
      <h1 className="text-3xl font-bold">Settings Page</h1>
      <div className="w-full flex items-start mt-8">
        <img src={pfp} alt="Profile Picture" className="w-48 h-48 rounded-full mr-4" />
        <div className="w-1/2">
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Email" value={email} onChange={setEmail} />
          <Input label="Profile Picture URL" value={pfp} onChange={setPfp} />
          <button className="text-white px-4 py-2 rounded-md hover:bg-black/10 mr-4" onClick={handleReset}>Reset</button>
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage;
