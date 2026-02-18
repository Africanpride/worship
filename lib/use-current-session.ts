import { useSession } from "@/lib/auth-client";

export function useCurrentSession() {
  const { data: session, isPending, error } = useSession();
  
  return {
    session,
    user: session?.user,
    isPending,
    isAuthenticated: !!session?.user,
    error,
  };
}
