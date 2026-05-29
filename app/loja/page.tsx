"use client"

import Navbar from "@/components/navbar";
import Image from "next/image";
import { useState } from "react";
import garotas from "../../public/imagem_loja.svg"
import escuro from "../../public/telaloja_degrade.svg"
import nome from "../../public/rareBeauty_loja.png"
import StarRating from "@/components/StarRating"; 

type Task = {
    id: number;
    title: string;
    description: string;
    done: boolean;
    creatAT: string;
    updatedAT?: string;
    expanded?: boolean;
}

export default function Tela_loja(){
    const [task, setTasks] = useState<Task[]>([]);
    
    const [storeRating, setStoreRating] = useState<number>(4.75);

    const handleRatingUpdate = (newRating: number) => {
        setStoreRating(newRating);
        console.log("Nova nota enviada pelo usuário:", newRating);
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-black min-w-[1200px] overflow-x-auto">
            <Navbar /> 

            <div className="relative w-full h-auto overflow-hidden">
                
                <Image 
                    src={garotas} 
                    alt="Garotas"
                    className="w-full h-auto relative z-0"
                />

                <Image 
                    src={escuro} 
                    alt="Degradê escuro" 
                    className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                />

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                    
                    <div className="mb-2">
                        <Image 
                            src={nome} 
                            alt="Rare Beauty"
                            className="w-[450px] h-auto object-contain" 
                        />
                    </div>

                    <p className="text-[#F6F3E4]/90 text-lg font-light lowercase tracking-widest -mt-7 -ml-98">
                        beleza
                    </p>

                    <p className="absolute bottom-6 right-12 text-[#F6F3E4]/90 text-sm tracking-wide">
                        by Selena Gomez
                    </p>
                </div>

            </div>

            <div className="bg-black w-full py-12 flex flex-col items-center justify-center gap-6">
                <h2 className="text-[#F6F3E4] text-3xl font-semibold tracking-wide">Reviews e Comentários</h2>
                
                <StarRating 
                    rating={storeRating} 
                    onRatingChange={handleRatingUpdate} 
                />
            </div>

        </div>
    )
}