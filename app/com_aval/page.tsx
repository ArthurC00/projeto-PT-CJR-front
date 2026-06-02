"use client"

import Navbar from "@/components/navbar";
import {useState, FormEvent} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


export default function com_aval(){
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Usuário';
    const text = searchParams.get('text') || 'Sem comentário.';
    const rating = searchParams.get('rating') || '0';
    const [respostas, setRespostas] = useState([
        {id: 1, autor: "Suporte Loja", texto: "Muito obrigada pelo o feedback!"}
    ]);
    const [novaResposta, setNovaResposta] = useState("");
    const lidarComEnvio = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!novaResposta.trim()) return;

        const nova = {
            id: Date.now(),
            autor: "Você",
            texto: novaResposta
        };

        setRespostas([...respostas, nova]);
        setNovaResposta("");
    };

    return (
    <div className="min-h-screen bg-[#F6F3E4] overflow-x-auto flex flex-col">
        <Navbar />

        <div className="bg-black w-full pt-24 pb-12 flex flex-col items-center justify-start px-4">

            {/* Card do comentário clicado aparecendo aqui dentro da parte preta */}
            <div className="bg-[#F6F3E4] text-black p-6 rounded-2xl w-full max-w-[600px] shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <span className="text-xs text-neutral-500">Avaliação enviada</span>
                </div>
                <div className="text-amber-400 font-bold">
                {"★".repeat(Number(rating))}
                </div>
            </div>
            <p className="italic text-gray-800">"{text}"</p>
        </div>

        <Link href="/loja" className="mt-6 text-sm text-gray-400 hover:underline">
        ← Voltar para a loja
        </Link>  
        </div>

        {/* PARTE BEGE: Respostas a este comentário */}
      <main className="w-full max-w-[600px] mx-auto px-4 py-8 flex-1 flex flex-col gap-6">
        
        {/* Formulário para criar uma resposta */}
        <form onSubmit={lidarComEnvio} className="flex flex-col gap-3">
          <label className="text-black font-semibold text-sm">
            Responder a este comentário:
          </label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={novaResposta}
              onChange={(e) => setNovaResposta(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="flex-1 p-3 rounded-xl border border-neutral-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <button 
              type="submit"
              className="bg-black text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors"
            >
              Responder
            </button>
          </div>
        </form>

        <hr className="border-neutral-300 my-2" />

        {/* Lista de Respostas na parte bege */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-black">
            Respostas ({respostas.length})
          </h2>

          {respostas.map((resp) => (
            <div 
              key={resp.id} 
              className="bg-white text-black p-4 rounded-xl shadow-sm border border-neutral-200 ml-6 relative before:content-[''] before:absolute before:left-[-14px] before:top-6 before:w-3 before:h-[2px] before:bg-neutral-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-neutral-800">
                  {resp.autor}
                </span>
                <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                  Resposta
                </span>
              </div>
              <p className="text-gray-700 text-sm">{resp.texto}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}