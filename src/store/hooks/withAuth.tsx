// withAuth.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accessTokenKey } from "@/utils/consts";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuth = (props: any) => {
    const [user, setUser] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
      let token = localStorage.getItem(accessTokenKey);
      if (token) {
        setUser(token);
      }
      setLoading(false);
    }, []);

    useEffect(() => {
      if (!user && !loading) {
        router.push("/auth/auth2/login");
      }
    }, [user, router, loading]);

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
