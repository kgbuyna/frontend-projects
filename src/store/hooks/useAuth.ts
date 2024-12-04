import { useUserData } from "./UserContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Login {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}

const useAuth = (): { user: Login | null } => {
  const { user } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return { user };
};

export default useAuth;
