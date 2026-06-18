"use client";

import { useEffect } from "react";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { IoMdExit } from "react-icons/io";

import Image from "next/image";
import Link from "next/link";
import { decodeUserToken } from "@/app/utils/auth";

type NavbarProps = {
  isLogged: boolean;
};

export default function Navbar() {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [myProfile, setMyProfile] = useState<number>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const urlComplete = query ? `${pathname}?${query}` : pathname;
  const returnTo = encodeURIComponent(urlComplete);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = decodeUserToken(token);
      setMyProfile(data?.userId);
      setIsLogged(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    window.location.reload();
  };

  const handleProfile = () => {
    router.push(`/profile/${myProfile}`);
  };

  return isLogged ? (
    <nav className="flex justify-between min-h-15 min-w-screen bg-black justify-items-center ">
      <h1>
        <Link href="/feed">
          <Image
            className="relative top-4 left-14 h-9 w-auto object-contain"
            src="/logobranca.png"
            alt="logo"
            // width={150}
            // height={100}
            width={221}
            height={43}
          />
        </Link>
      </h1>
      <div className="justify-items-right bg-black grid grid-cols-2 gap-1 mr-7 mt-3">
        <a className="" onClick={handleProfile}>
          <CgProfile className=" mt-0.5 h-7 w-7  text-white hover:text-blue-500 " />
        </a>
        <a className="object-cover" onClick={handleLogout}>
          <IoMdExit className=" mr-0.5 h-8 w-8 text-white hover:text-red-500 " />
        </a>
      </div>
    </nav>
  ) : (
    <nav className="flex justify-between min-h-15 min-w-screen bg-black justify-items-center ">
      <h1>
        <Link href="/feed">
          <Image
            className="relative top-4 left-14 h-9 w-auto object-contain"
            src="/logobranca.png"
            alt="logo"
            // width={150}
            // height={100}
            width={221}
            height={43}
          />
        </Link>
      </h1>
      <div className="justify-items-right ">
        <Link
          className="text-white cursor-pointer hover:underline relative right-32 top-4.5 text-lg"
          href={`/login?returnTo=${returnTo}`}
        >
          {" "}
          LOGIN
        </Link>
        <Link
          className="relative right-25 top-4.5 bg-blue-500 rounded-2xl px-4 py-2 text-white cursor-pointer hover:bg-blue-900 text-lg justify items-center justify-center"
          href={"/cadastro"}
        >
          {" "}
          CADASTRE-SE
        </Link>
      </div>
    </nav>
  );
}
