"use client"

import Navbar from "@/components/navbar";
import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/modal";

export default function com_aval() {
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Usuário';
    const text = searchParams.get('text') || 'Sem comentário.';
    const rating = searchParams.get('rating') || '0';
    
    // 1. ESTADO PARA CONTROLAR O MODAL (Aberto/Fechado)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [respostas, setRespostas] = useState([
        { id: 1, autor: "Suporte Loja", texto: "Muito obrigada pelo o feedback!" }
    ]);
    const [novaResposta, setNovaResposta] = useState("");

    const lidarComEnvio = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!novaResposta.trim()) return;

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

                    {/* botão para abrir o modal */}
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                        >
                            Quero editar minha avaliação
                        </button>
                    </div>
                </div>

                <Link href="/loja" className="mt-6 text-sm text-gray-400 hover:underline">
                    ← Voltar para a loja
                </Link>
            </div>

            <main className="w-full max-w-[600px] mx-auto px-4 py-8 flex-1 flex flex-col gap-6">

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

            {/* modal */}
            {isModalOpen && (
                <Modal 
                  onClose={() => setIsModalOpen(false)}
                  width="max-w-md"
                  height="auto"
                >
                  <div className="relative p-6 bg-[#F0F0F0] text-black font-sans rounded-2xl">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-4 right-4 text-2xl font-light hover:opacity-70 transition-opacity"
                      >
                        &times;
                        </button>

                      {/* título */}
                      <h2 className="text-xl text-center font-normal text-{#2D2D2D] mt-4 mb-4">
                        Você está avaliando <span className="font-semibold">Rare Beauty</span>
                      </h2>

                      {/* star */}
                      <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-10 h-10 text-[#A880FF] fill-none stroke-current stroke-1 cursor-pointer hover:fill-[#A880FF] transition-colors"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>

                      <textarea
                        className="w-full p-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white focus:outline-none text-xs placeholder-neutral-400 shadow-sm"
                        defaultValue={text}
                        placeholder="Avaliação da loja"
                        rows={6}
                        />
                      <div className="flex flex-col gap-3 mt-8 items-center w-full">

                        {/* Botão - deletar */}
                        <button
                          onClick={()=> {
                            if(confirm("Tem certeza que deseja deletar?")){
                              setIsModalOpen(false);
                            }
                          }}
                          className="w-[85%] bg-[#E53E2E] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-red-700 transition-colors"
                          >
                            Deletar
                          </button>

                          {/* Botão - salvar */}
                          <button
                          onClick={()=>{
                            alert("Avaliação atualizada!");
                            setIsModalOpen(false);
                          }}
                          className="w-[85%] bg-[#633BFA] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-mediumpurple transition-colors"
                          >
                            Salvar 
                          </button>
                        </div>
                      </div>
                    </Modal>
                  )}
                </div>
  );
}


  