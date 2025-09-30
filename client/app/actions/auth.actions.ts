"use server"

import { cookies } from "next/headers";
import { ActionResponse } from "@/types/action-response";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const signUp = async (name: string, email: string, password: string) : Promise<ActionResponse> => { 
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error creating user" };
    }
    const token = res.headers.get('Set-Cookie')?.split(';')[0].split('=')[1]!;
    cookieStore.set("token", token, { httpOnly: true, path: '/' });
    redirect("/");
  } catch (error) {
    if(isRedirectError(error)) {
      throw error;
    }
    console.error("Error during sign up:", error);
    return { ok: false, message: "Error creating user", error };
  }
};

export const signIn = async (name: string, password: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error signing in" };
    }
    const token = res.headers.get('Set-Cookie')?.split(';')[0].split('=')[1]!;
    cookieStore.set("token", token, { httpOnly: true, path: '/' , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
    redirect("/");
  } catch (error) {
    if(isRedirectError(error)) {
      throw error;
    }
    console.error("Error during sign in:", error);
    return { ok: false, message: "Error signing in", error };
  }
};

export const validateToken = async () : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return { ok: true, data: {userId: decoded.userId}, message: "Token is valid" };
  } catch (error) {
    console.error("Invalid token:", error);
    cookieStore.delete("token");
    cookieStore.delete("user");
    return { ok: false, message: "Invalid token", error };
  }
};

export const getCurrentUser = async () : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get("token");
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/auth/validate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token.value}`
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error fetching user" };
    }
    const data = await res.json();
    console.log("Fetched current user:", data);
    return { ok: true, message: "User fetched successfully", data };
  } catch (error) {
    console.error("Error fetching current user:", error);
    cookieStore.delete("token");
    return { ok: false, message: "Error fetching user", error };
  }
}

export const signOut = async () : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try {
    cookieStore.delete("token");
    cookieStore.delete("user");
    redirect("/login");
  } catch (error) {
    if(isRedirectError(error)) return { ok: false, message: "Redirecting" };
    console.error("Error during sign out:", error);
    return { ok: false, message: "Error signing out", error};
  }
};
