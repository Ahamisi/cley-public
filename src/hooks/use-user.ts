import { useUserStore } from "@/store/user-store";

export function useUser() {
  const { user, setUser, clearUser } = useUserStore();

  return {
    user,
    setUser,
    clearUser,
    isAuthenticated: !!user,
  };
}

