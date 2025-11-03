"use server"
import { ActionResponse } from "@/types/action-response";
import { cookies } from "next/headers";

export const updateUser = async (name?: string, email?: string, pfp?: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const body: {name?: string, email?: string, pfp?: string} = {};
    if(name) body.name = name;
    if(email) body.email = email;
    if(pfp) body.pfp = pfp;
    const res = await fetch(`${process.env.SERVER_URL}/api/users`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error updating user" };
    }
    const data = await res.json();
    return { ok: true, message: "User updated successfully", data: data.user };
  } catch (error) {
    return { ok: false, message: "Error updating user", error };
  }
}
