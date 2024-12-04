"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement
} from "react";
import { useRouter } from "next/navigation";
import { accessTokenKey, refreshTokenKey } from "@/utils/consts";
import { Oauth } from "@/app/(DashboardLayout)/types/apps/users";
import { postRequest } from "@/utils/network/handlers";

interface UserContextProps {
  user: Oauth | null;
  login: (credentials: object) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps): ReactElement => {
  const [user, setUser] = useState<Oauth | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: object) => {
    try {
      const response = await postRequest<{ token: string }>(
        "auth/login/",
        credentials
      );
      const token = response.data?.token;
      if (token) {
        setToken(token);
        localStorage.setItem(accessTokenKey, token);
      } else {
        throw new Error("Token is undefined");
      }
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    router.push("/auth/auth2/login");
  };

  return (
    <UserContext.Provider value={{ user, logout, token, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
