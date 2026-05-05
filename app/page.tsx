'use client'
import React from 'react';
import Image from 'next/image'; 

export default function TodoList() {
  const campos = ["Nome Completo", "Username", "Email", "Senha", "Confirmar Senha"];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-amber-50 p-10 md:p-20 w-full"> {/* div pai*/}
      
      <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
        <div className="w-full max-w-md min-h-[600px] bg-black/95 rounded-[40px] p-10 flex flex-col items-center shadow-2xl">      
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

      {/* imagens colocadas mais pra direita */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative h-[300px] md:h-[600px]">
        
        <div className="relative w-full h-full bottom-0 md:bottom-0">
          
          {/* imagem LOGO */}
          <div className="absolute -top-15 left-1/2 -translate-x-1/2 z-10 w-60 h-32">
            <Image 
              src="/logo.png" 
              alt="Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* style: alterei a escala e tamanho da imagem principal */}
          <Image 
            src="/foto.png" 
            alt="Ilustração"
            fill 
            style={{ objectFit: 'contain', objectPosition: 'center' }} 
            priority 
            className="scale-80" 
          />
        </div>
      </div>

    </div>
  );
}