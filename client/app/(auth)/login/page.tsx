"use client";
import { signIn } from "@/app/actions/auth.actions";
import Link from "next/link";

const LoginPage = () => {

  const HandleLogin = async (formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const res = await signIn(username, password);
    if (res && !res.ok) {
      alert(res.message);
    }
  }

  return <div className="flex flex-col w-full h-screen items-center justify-center">
    <form action={HandleLogin} className="flex flex-col gap-4 bg-foreground p-8 rounded-lg border border-background">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <input type="text" name="username" placeholder="Username" className="p-2 border border-background rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"/>
      <input type="password" name="password" placeholder="Password" className="p-2 border border-background rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"/>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 mt-4">Sign In</button>
      <Link href="/register" className="text-sm text-center text-white/50 hover:text-white mt-2">Don't have an account? Register</Link>
    </form>
  </div>;
}

export default LoginPage;
