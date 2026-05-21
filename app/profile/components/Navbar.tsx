"use client";

import Image from "next/image";
import stockioLogo from "../../../public/logoStockio.svg";
import Link from "next/link";
import profileIcon from "../../../public/navbarProfile.svg";
import logoutIcon from "../../../public/logoutIcon.svg";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myId, setMyId] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { userId } = jwtDecode<UserDataProps>(token);
      setMyId(userId);
    }
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleProfile = () => {
    router.push(`/profile/${myId}`);
  };

  function AuthButtons() {
    return (
      <main className="flex text-white items-center justify-center gap-10">
        {isLoggedIn ? (
          <>
            <button
              className="hover:scale-105 transition"
              onClick={handleProfile}
            >
              <Image src={profileIcon} alt={"Perfil"} />
            </button>
            <button
              className="hover:scale-105 transition"
              onClick={handleLogout}
            >
              <Image src={logoutIcon} alt={"LogOut"} />
            </button>
          </>
        ) : (
          <>
            <Link
              href={`/login?returnTo=${encodeURIComponent(pathname)}`}
              className="font-spartan px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              LOGIN
            </Link>
            <Link
              href="/cadastro"
              className="font-spartan bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
            >
              CADASTRE-SE
            </Link>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="flex w-full py-3 bg-black items-center justify-between px-16">
      <Image src={stockioLogo} width={220} alt="stock.io"></Image>
      <AuthButtons />
    </main>
  );
}
