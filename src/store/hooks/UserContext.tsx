"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement
} from "react";
import { useRouter } from "next/navigation";
import { postLogin } from "@/utils/network/handlers";
import { accessTokenKey, refreshTokenKey } from "@/utils/consts";
import { Oauth } from "@/app/(DashboardLayout)/types/apps/users";

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
  const router = useRouter();

  const login = async (credentials: object) => {
    try {
      const response = await postLogin<Oauth>("/oauth2/token/", credentials, {
        headers: {
          "Content-Type": "multipart/form-data;"
        }
      });
      if (response.access_token) {
        localStorage.setItem(accessTokenKey, response.access_token);
        // localStorage.setItem(accessTokenKey, "nSRJc9v8ykZrJCPNgLwsawCnMo30dw");
        localStorage.setItem(refreshTokenKey, response.refresh_token);
        router.push("/");
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
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
