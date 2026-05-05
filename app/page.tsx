'use client'
import React from 'react';

export default function TodoList() {
  const campos = ["Nome Completo", "Username", "Email", "Senha", "Confirmar Senha"];

  return (
    <div className="flex items-center justify-start min-h-screen bg-amber-100 p-20"> {/* div pai */}
      <div className="w-full max-w-md min-h-[600px] bg-black/90 rounded-[40px] p-10 flex flex-col items-center">
        
        <h1 className="text-white text-2xl font-bold mb-10 tracking-widest">CRIE SUA CONTA</h1>

        <div className="w-full flex flex-col gap-4">
          {campos.map((label, index) => (
            <div key={index} className="relative w-full">
              <input 
                type={label.includes("Senha") ? "password" : "text"} 
                placeholder={label} 
                className="w-full py-3 px-6 rounded-full bg-[#F5F5DC] text-gray-500 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {label.includes("Senha") && (
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"></span>
              )}
            </div>
          ))}
        </div>

        <button className="w-full mt-10 bg-indigo-600 text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition-all">
          ENTRAR
        </button>

        <p className="text-gray-400 mt-4 text-sm">
          Já possui uma conta? <span className="text-indigo-400 cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );
}