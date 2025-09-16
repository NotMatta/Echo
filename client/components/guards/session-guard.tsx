import { validateToken } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";

interface SessionGuardProps {
  children: React.ReactNode;
  guardFor: "authenticated" | "unauthenticated";
}

const SessionGuard = async ({ children, guardFor }: SessionGuardProps) => {

  const { ok : isAuthenticated } = await validateToken();
  
  if (!isAuthenticated && guardFor === "authenticated") {
    redirect("/signin");
  } else if (isAuthenticated && guardFor === "unauthenticated") {
    redirect("/");
  }

  return children
}

export default SessionGuard;
