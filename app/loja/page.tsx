"use client"

import Navbar from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect } from "react"; 
import garotas from "../../public/imagem_loja.svg"
import escuro from "../../public/telaloja_degrade.svg"
import nome from "../../public/rareBeauty_loja.png"
import StarRating from "@/components/StarRating"; 

type Review = {
    id: number;
    userName: string;
    userRating: number;
    comment: string;
    createdAt: string;
}

export default function Tela_loja(){
    const reviewPadrao: Review[] = [
        { 
            id: 1, 
            userName: "Sofia Figueiredo", 
            userRating: 4.75, 
            comment: "Os produtos são simplesmente perfeitos! A pigmentação do blush é surreal de boa, vale cada centavo.",
            createdAt: "01/06/2026" 
        }
    ];

    const [reviews, setReviews] = useState<Review[]>([]);
    
    const [inputName, setInputName] = useState("");
    const [inputComment, setInputComment] = useState(""); 
    const [userSelectedRating, setUserSelectedRating] = useState(5);

    useEffect(() => {
        const comentariosSalvos = localStorage.getItem("@rareBeauty:reviews");
        if (comentariosSalvos) {
            setReviews(JSON.parse(comentariosSalvos));
        } else {
            setReviews(reviewPadrao);
        }
    }, []);

    useEffect(() => {
        if (reviews.length > 0) {
            localStorage.setItem("@rareBeauty:reviews", JSON.stringify(reviews));
        }
    }, [reviews]);

    const calcularMedia = (listaDeReviews: Review[]) => {
        if (listaDeReviews.length === 0) return 0;
        const soma = listaDeReviews.reduce((acc, rev) => acc + rev.userRating, 0);
        return soma / listaDeReviews.length;
    };

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputName.trim() || !inputComment.trim()) return;

        const newReview: Review = {
            id: Date.now(),
            userName: inputName,
            userRating: userSelectedRating,
            comment: inputComment,
            createdAt: new Date().toLocaleDateString('pt-BR')
        };

        const listaAtualizada = [newReview, ...reviews];
        setReviews(listaAtualizada);
        
        setInputName("");
        setInputComment("");
        setUserSelectedRating(5);
    };

    const storeRating = calcularMedia(reviews);

    return (
        <div className="relative flex flex-col min-h-screen bg-black min-w-[1200px] overflow-x-auto">
            <Navbar /> 

            {/* banner  */}
            <div className="relative w-full h-auto overflow-hidden">
                <Image src={garotas} alt="Garotas" className="w-full h-auto relative z-0" />
                <Image src={escuro} alt="Degradê escuro" className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                    <div className="mb-2">
                        <Image src={nome} alt="Rare Beauty" className="w-[450px] h-auto object-contain" />
                    </div>
                    <p className="text-[#F6F3E4]/90 text-lg font-light lowercase tracking-widest -mt-7 -ml-98">beleza</p>
                    <p className="absolute bottom-6 right-12 text-[#F6F3E4]/90 text-sm tracking-wide">by Selena Gomez</p>
                </div>
            </div>

            {/* reviews e média */}
            <div className="bg-black w-full py-12 flex flex-col items-center justify-center gap-6">
                <h2 className="text-[#F6F3E4] text-3xl font-semibold tracking-wide">Reviews e Comentários</h2>
                
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[#F6F3E4] text-5xl font-bold decoration-1 underline-offset-8">
                        {storeRating.toFixed(2)}
                    </span>
                    <StarRating rating={storeRating} />
                </div>

                {/* formulário */}
                <form onSubmit={handleAddReview} className="w-[600px] mt-6 p-6 border border-[#F6F3E4]/20 rounded-xl bg-neutral-900/50 flex flex-col gap-4">
                    <h3 className="text-[#F6F3E4] text-lg font-medium">Deixe sua avaliação</h3>
                    
                    {/* Input do Nome */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#F6F3E4]/70 text-sm">Seu Nome</label>
                        <input 
                            type="text" 
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="Ex: Sofia Figueiredo"
                            className="bg-black text-[#F6F3E4] border border-[#F6F3E4]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#F6F3E4] text-sm"
                        />
                    </div>

                    {/* Input do Comentário */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#F6F3E4]/70 text-sm">Seu Comentário</label>
                        <textarea 
                            value={inputComment}
                            onChange={(e) => setInputComment(e.target.value)}
                            placeholder="O que você achou da loja e dos produtos?"
                            rows={3}
                            className="bg-black text-[#F6F3E4] border border-[#F6F3E4]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#F6F3E4] text-sm resize-none"
                        />
                    </div>

                    {/* estrelas e botão */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[#F6F3E4]/70 text-sm">Sua Nota:</span>
                            <StarRating rating={userSelectedRating} onRatingChange={setUserSelectedRating} />
                        </div>
                        <button 
                            type="submit"
                            className="bg-[#F6F3E4] text-black px-6 py-2 rounded-full font-medium hover:bg-[#F6F3E4]/80 transition-all text-sm shadow-md"
                        >
                            Avaliar
                        </button>
                    </div>
                </form>

                {/* lista de comentários */}
                <div className="w-[600px] flex flex-col gap-4 mt-8">
                    {reviews.map((rev) => (
                        <div 
                            key={rev.id} 
                            className="bg-[#F6F3E4] text-black w-full rounded-2xl p-5 flex flex-col gap-3 shadow-lg"
                        >
                            {/* Cabeçalho do Card */}
                            <div className="flex items-start justify-between w-full">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-neutral-300 rounded-full overflow-hidden flex items-center justify-center font-bold text-neutral-600 shrink-0">
                                        {rev.userName ? rev.userName.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-lg leading-tight">{rev.userName}</span>
                                        <span className="text-xs text-neutral-500">{rev.createdAt}</span>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <StarRating rating={rev.userRating} />
                                </div>
                            </div>

                            {/* Corpo do Card */}
                            <div className="pl-16"> 
                                <p className="text-neutral-700 text-sm leading-relaxed break-words">
                                    "{rev.comment}"
                                </p>
                            </div>
                        </div>
                    ))}

                    {reviews.length === 0 && (
                        <p className="text-[#F6F3E4]/50 text-center text-sm italic">Nenhuma avaliação ainda. Seja o primeiro!</p>
                    )}
                </div>
            </div>
        </div>
    )
}