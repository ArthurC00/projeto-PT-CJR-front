"use client"

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/modal";

interface AvaliacaoTipo {
    id: number;
    texto: string;
    estrelas: number;
}

export default function com_aval() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // infos vindas da URL
    const reviewId = Number(searchParams.get('id'));
    const name = searchParams.get('name') || 'Usuário';
    const text = searchParams.get('text') || 'Sem comentário.';
    const rating = Number(searchParams.get('rating')) || 0; // Convertido para número
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [respostas, setRespostas] = useState([
        { id: 1, autor: "Suporte Loja", texto: "Muito obrigada pelo o feedback!" }
    ]);
    const [novaResposta, setNovaResposta] = useState("");

    // Estado da avaliação atual
    const [avaliacao, setAvaliacao] = useState<AvaliacaoTipo | null>({
        id: reviewId,
        texto: text,
        estrelas: rating
    });

    // Estados temporários para controlar o formulário dentro do Modal
    const [textoTemporario, setTextoTemporario] = useState(text);
    const [estrelasTemporarias, setEstrelasTemporarias] = useState(rating);
    const [hoverEstrelas, setHoverEstrelas] = useState<number | null>(null); // Efeito visual de hover

    // Sincroniza os estados caso os parâmetros da URL mudem
    useEffect(() => {
        if (text) setTextoTemporario(text);
        if (rating) setEstrelasTemporarias(rating);
    }, [text, rating]);

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

    // para salvar alteração no localstorage
    const handleSalvar = async () => {
        if (!avaliacao || !reviewId) return;

        try {
            const itensSalvos = localStorage.getItem("@rareBeauty:reviews");
            if (itensSalvos) {
                const listaReviews = JSON.parse(itensSalvos);
                
                // Mapeia alterando o texto (comment) E as estrelas (userRating)
                const listaAtualizada = listaReviews.map((rev: any) => {
                    if (rev.id === reviewId) {
                        return { 
                            ...rev, 
                            comment: textoTemporario, 
                            userRating: estrelasTemporarias 
                        };
                    }
                    return rev;
                });

                localStorage.setItem("@rareBeauty:reviews", JSON.stringify(listaAtualizada));
            }

            // Atualiza o estado visual da tela de edição
            setAvaliacao({ 
                ...avaliacao, 
                texto: textoTemporario, 
                estrelas: estrelasTemporarias 
            });
            
            alert("Avaliação atualizada com sucesso!");
            setIsModalOpen(false);
        } catch(error) {
            alert("Erro ao salvar alteração.");
        }
    };

    // deletar no localstorage
    const handleDeletar = async () => {
        if (!reviewId) return;

        if (confirm("Tem certeza absoluta que deseja deletar sua avaliação?")){
            try {
                const itensSalvos = localStorage.getItem("@rareBeauty:reviews");
                if (itensSalvos) {
                    const listaReviews = JSON.parse(itensSalvos);
                    const listaFiltrada = listaReviews.filter((rev: any) => rev.id !== reviewId);
                    localStorage.setItem("@rareBeauty:reviews", JSON.stringify(listaFiltrada));
                }

                setAvaliacao(null);
                setTextoTemporario("");

                alert("Avaliação deletada.");
                setIsModalOpen(false);
                router.push("/loja");
            } catch(error) {
                alert("Erro ao deletar.");
            }
        }
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
                        
                        {/* Mostra as estrelas atualizadas do estado atualizado */}
                        <div className="text-amber-400 font-bold text-lg">
                            {"★".repeat(avaliacao ? avaliacao.estrelas : 0)}
                        </div>
                    </div>
                    
                    <p className="italic text-gray-800">
                        {avaliacao ? `"${avaliacao.texto}"` : "Esta avaliação foi deletada."}
                    </p>

                    {avaliacao && (
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                            >
                                Quero editar minha avaliação
                            </button>
                        </div>
                    )}
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
                    height="auto">
                    <div className="text-black font-sans w-full h-full pt-4">

                        <h2 className="text-xl text-center font-normal text-[#2D2D2D] mt-4 mb-4">
                            Você está avaliando <span className="font-semibold">Rare Beauty</span>
                        </h2>

                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const devePreencher = hoverEstrelas !== null ? star <= hoverEstrelas : star <= estrelasTemporarias;
                                
                                return (
                                    <svg 
                                        key={star} 
                                        onClick={() => setEstrelasTemporarias(star)}
                                        onMouseEnter={() => setHoverEstrelas(star)}
                                        onMouseLeave={() => setHoverEstrelas(null)}
                                        className={`w-10 h-10 text-[#A880FF] stroke-current stroke-1 cursor-pointer transition-colors ${
                                            devePreencher ? "fill-[#A880FF]" : "fill-none"
                                        }`} 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                );
                            })}
                        </div>

                        <textarea
                            className="w-full p-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white focus:outline-none text-xs"
                            value={textoTemporario}
                            onChange={(e) => setTextoTemporario(e.target.value)}
                            placeholder="Avaliação da loja"
                            rows={6}
                        />

                        <div className="flex flex-col gap-3 mt-8 items-center w-full">
                            <button
                                onClick={handleDeletar}
                                className="w-[85%] bg-[#E53E2E] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                            >
                                Deletar
                            </button>

                            <button
                                onClick={handleSalvar}
                                className="w-[85%] bg-[#633BFA] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
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