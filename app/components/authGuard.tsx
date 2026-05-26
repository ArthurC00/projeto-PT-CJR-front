"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const PUBLIC_ROUTES = ["/", "/login", "/registro"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const authCheck = () => {
      const token = localStorage.getItem("token");
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (isPublicRoute) {
        setAuthorized(true);
        return;
      }

      if (!token) {
        setAuthorized(false);
        router.push("/login");
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setAuthorized(false);
          router.push("/login");
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setAuthorized(false);
        router.push("/login");
      }
    };

    authCheck();
  }, [pathname, router]);

  return authorized ? <>{children}</> : null;
}
