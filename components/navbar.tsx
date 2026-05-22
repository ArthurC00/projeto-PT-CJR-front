"use cleint";

import React from 'react';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link"


type NavbarProps = {
    isLogged: boolean;
};

export default function Navbar( {isLogged} : NavbarProps) {

    return (
        isLogged ? (
       <nav className="flex justify-between min-h-15 min-w-screen bg-black justify-items-center "> 
                           <h1>
                            <Image
                             className="relative top-3 left-4"
                             src="/logobranca.png" 
                             alt="logo"
                             width={150}
                             height={100}
                           />   
                           </h1>
                           <div className="justify-items-right bg-black grid grid-cols-2 gap-1 mr-7 mt-3">
                               <a href="/perfil" className="">
                               <Image
                               className="object-cover hover:opacity-35"
                               src="/navBarLogged/perfil.png"
                               alt="perfil"
                               width={30}
                               height={30}            
                               />
                               </a>
                               <a href="/sair" className="object-cover hover:opacity-35">
                               <Image
                               className="object-cover"
                               src="/navBarLogged/exit.png"
                               alt="sair"
                               width={30}
                               height={30}            
                               />
                               </a>
                           </div>
                       </nav> 
    ) : (
        <nav className="flex justify-between min-h-15 min-w-screen bg-black justify-items-center "> 
            <h1>
             <Image
              className="relative top-3 left-4"
              src="/logobranca.png" 
              alt="logo"
              width={150}
              height={100}
            />   
            </h1>
            <div className="justify-items-right ">
              <Link
              className="text-white cursor-pointer hover:underline relative right-32 top-4.5 text-lg"
              href={"/login"}> LOGIN
              </Link>
              <Link className="relative right-25 top-4.5 bg-blue-500 rounded-2xl px-4 py-2 text-white cursor-pointer hover:bg-blue-900 text-lg justify items-center justify-center"
              href={"/cadastro"}> CADASTRE-SE
              </Link> 
            </div>
        </nav>
        )

    )
}