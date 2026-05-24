"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link"
import Navbar from "@/components/navbar";

export default function FeedPageLogged() {
  return (
    <div className="min-h-screen min-w-screen bg-amber-100"> 
      <div className=" object-cover min-w-screen min-h-95 max-h-112 bg-black justify-self-start"> 
        <Navbar isLogged = {true}/>
        <Image
        className=" ml-300 justify-baseline bottom-0.5"
        src="/girlBox.png"
        alt="mascote com caixas"
        width={450}
        height={600}
        />
        <div className="font-sans max-h-10 max-w-12xl justify-center relative left-100 bottom-60">
          <p className="text-white text-6xl"> do CAOS à organização,</p>
          <p className="text-white text-5xl relative left-22"> em apenas alguns cliques </p>
        </div>
      </div>
      <div className="justify-items-between justify-center">
        <input 
          type="search" 
          placeholder="procure aqui"
          className=" relative h-10 mt-5 ml-300 bg-white  w-150 px-4 rounded-full py-2 text-gray-700 focus:outline-none"
          />

      </div>

      <div className="justify-items-center justify-around">
        <h1 className="text-black text-4xl font-bold ml-40 relative top-15 tracking-wider">
          Categorias
        </h1>
        <div className="justify-center ml-20 mt-30 grid grid-cols-8 gap-1">
          <a>
            <Image
              className="object-cover"
              src="/categorias/Group 39.png"
              alt="eletronicos"
              width={120}
              height={120}            
            />
          </a>
          <a>
            <Image
              className="object-cover"
              src="/categorias/Group 36.png"
              alt="mercado"
              width={120}
              height={120}            
            />
          </a>
          <a>
            <Image
              className="object-cover"
              src="/categorias/Group 35.png"
              alt="moda"
              width={120}
              height={120}            
            />
          </a>
          <a>
            <Image
              className="object-cover"
              src="/categorias/Group 37.png"
              alt="jogos"
              width={120}
              height={120}            
            />
          </a>
           <a>
            <Image
              className="object-cover"
              src="/categorias/Group 33.png"
              alt="beleza"
              width={120}
              height={120}            
            />
          </a>
           <a>
            <Image
              className="object-cover"
              src="/categorias/Group 36.png"
              alt="mercado"
              width={120}
              height={120}            
            />
          </a>
          <a>
            <Image
              className="object-cover"
              src="/categorias/Group 40.png"
              alt="brinquedos"
              width={120}
              height={120}            
            />
          </a>
          <a>
            <Image
              className="object-cover"
              src="/categorias/Group 38.png"
              alt="farmácia"
              width={120}
              height={120}            
            />
          </a>
        </div>
      </div>
      <div>
        <h1 className="text-black text-4xl font-bold ml-40 relative top-15 tracking-wider">
          Produtos <Link className="text-xl text-blue-500 hover:text-blue-900" href={"/melhoresAvaliados"}> melhores avaliados </Link>
        </h1>
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