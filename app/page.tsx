'use client'
import React from 'react';
import Image from 'next/image'; 

export default function TodoList() {
  const campos = ["Nome Completo", "Username", "Email", "Senha", "Confirmar Senha"];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-amber-50 px-10 md:px-20 pt-10 pb-0 w-full gap-20 md:gap-30"> {/* div pai */}
      
      {/* [infos - formulário] LADO ESQUERDO  */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-end justify-start h-screen">
        <div className="w-full max-w-md mt-10 flex-1 bg-black/95 rounded-t-[40px] rounded-b-none p-10 flex flex-col items-center shadow-2xl">      
          <h1 className="text-white text-2xl font-bold mb-10 tracking-widest text-center">CRIE SUA CONTA</h1>

          <div className="w-full flex flex-col gap-4">
            {campos.map((label, index) => (
              <div key={index} className="relative w-full">
                <input 
                  type={label.includes("Senha") ? "password" : "text"} 
                  placeholder={label} 
                  className="w-full py-3 px-6 rounded-full bg-[#F5F1DA] text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          <button className="w-full mt-10 bg-[#7645D9] text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition-all text-sm tracking-wide">
            ENTRAR
          </button>

          <p className="w-full text-gray-400 mt-5 text-sm text-left">
            Já possui uma conta? <span className="text-indigo-400 cursor-pointer hover:underline">Login</span>
          </p>
        </div>
      </div>

      {/* [infos] LADO DIREITO  */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center relative h-[300px] md:h-[600px]">
        <div className="relative w-full h-full max-w-md"> 
          
          {/* [infos] Logo STOCK.IO*/}
          <div className="absolute -top-30 left-[35%] -translate-x-1/2 z-10 w-60 h-32">
            <Image 
              src="/logo.png" 
              alt="Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* [infos] Imagem boneca verde  */}
          <Image 
            src="/foto.png" 
            alt="Ilustração"
            fill 
            style={{ objectFit: 'contain', objectPosition: 'left' }} 
            priority 
            className="scale-100" // style: tamanho aumentado para preencher melhor
          />
        </div>
      </div>

    </div>
  );
}