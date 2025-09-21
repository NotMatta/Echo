"use server"

import { cookies } from "next/headers";
import prisma from "@/utils/prisma-client";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface SignInResult {
  ok: boolean;
  user?: { id: string; name: string; email: string };
  message: string;
  error?: any;
}

export const signUp = async (name: string, email: string, password: string) : Promise<SignInResult | void> => { 
  const cookieStore = await cookies();
  try {
    const hashedPassword = await hash(password, 10);
    const existingUser = await prisma.user.findFirst({
      where: {OR : [{ email }, { name }]},
    });
    if (existingUser) {
      return { ok: false, message: "User already exists" };
    }
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, { expiresIn: '7d' });
    cookieStore.set("token", token, { httpOnly: true, path: '/' });
    cookieStore.set("user", JSON.stringify({ id: user.id, name: user.name, email: user.email }), { path: '/' });
  redirect("/");
  } catch (error) {
    if(isRedirectError(error)) {
      throw error;
    }
    console.error("Error during sign up:", error);
    return { ok: false, message: "Error creating user", error };
  }
};

export const signIn = async (name: string, password: string) : Promise<SignInResult | void> => {
  const cookieStore = await cookies();
  try {
    const user = await prisma.user.findUnique({
      where: { name },
    });
    if (!user) {
      return { ok: false, message: "User not found" };
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return { ok: false, message: "Invalid password" };
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, { expiresIn: '7d' });
    cookieStore.set("token", token, { httpOnly: true, path: '/' , expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
    cookieStore.set("user", JSON.stringify({ id: user.id, name: user.name, email: user.email }), { path: '/' });
    redirect("/");
  } catch (error) {
    if(isRedirectError(error)) {
      throw error;
    }
    console.error("Error during sign in:", error);
    return { ok: false, message: "Error signing in", error };
  }
};

export const validateToken = async () : Promise<{ ok: boolean; userId?: string; message: string }> => {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return { ok: true, userId: decoded.userId, message: "Token is valid" };
  } catch (error) {
    console.error("Invalid token:", error);
    cookieStore.delete("token");
    cookieStore.delete("user");
    return { ok: false, message: "Invalid token" };
  }
};

export const getCurrentUser = async () : Promise<{ ok: boolean; user?: { id: string; name: string; email: string, pfp: string | null }; message: string }> => {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, pfp: true },
    });
    if (!user) {
      return { ok: false, message: "User not found" };
    }
    return { ok: true, user, message: "User fetched successfully" };
  } catch (error) {
    console.error("Error fetching current user:", error);
    cookieStore.delete("token");
    cookieStore.delete("user");
    return { ok: false, message: "Error fetching user" };
  }
}

export const signOut = async () : Promise<{ ok: boolean; message: string | void }> => {
  const cookieStore = await cookies();
  try {
    cookieStore.delete("token");
    cookieStore.delete("user");
    redirect("/login");
  } catch (error) {
    if(isRedirectError(error)) {
      throw error;
    }
    console.error("Error during sign out:", error);
    return { ok: false, message: "Error signing out" };
  }
};
