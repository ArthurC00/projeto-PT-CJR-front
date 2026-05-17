"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link"

export default function FeedPageCategoriaDeslogado() {
  return (
    <div className="min-h-screen min-w-screen bg-amber-100"> 
      <div className=" object-cover min-w-screen min-h-95 max-h-112 bg-black justify-self-start"> 
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
        <Image
        className=" ml-300 justify-baseline bottom-0.5"
        src="/MascoteMasculino.png"
        alt="mascote com celular"
        width={280}
        height={500}
        />
        <div className="font-sans max-h-10 max-w-12xl justify-center relative left-100 bottom-60">
          <p className="text-white text-6xl"> o universo da tecnologia,</p>
          <p className="text-white text-5xl relative left-85"> em um só lugar </p>
        </div>
      </div>
      <div className="justify-items-between justify-center">
        <input 
          type="search" 
          placeholder="procure aqui"
          className=" relative h-10 mt-5 ml-300 bg-white  w-150 px-4 rounded-full py-2 text-gray-700 focus:outline-none"
          />

      </div>

      <div className="justify-items-center grid grid-cols-2 gap-0.5 mt-5 ml-16">
        <div className= "justify-items-center justify-between grid grid-cols-4 gap-3 mt-5" >
          <p className="bg-white px-5 py-2 rounded-full text-2xl text-blue-400"> subcategoria </p>
          <p className="bg-white px-5 py-2 rounded-full text-2xl text-blue-400"> subcategoria </p>
          <p className="bg-white px-5 py-2 rounded-full text-2xl text-blue-400"> subcategoria </p>
          <p className="bg-white px-5 py-2 rounded-full text-2xl text-blue-400"> subcategoria </p>
        </div>
        <p className="bg-white px-10 py-4 rounded-full text-2xl text-blue-400"> ordenar por </p>
      </div>
      
      <div>
        <div className="justify-center grid grid-cols-5 gap-2 mt-40 ml-20">
           <a>
            <Image
              className="object-cover"
              src="/placeHolder_produtos/Group 46.png"
              alt="smartTv" 
              width={300}
              height={600}           
            />
          </a>
          <a>
            <Image
              className="object-cover"
              src="/placeHolder_produtos/Group 45.png"
              alt="notebook"
              width={300}
              height={600}            
            />
          </a>

        </div>
      </div>
    </div>
  );
}