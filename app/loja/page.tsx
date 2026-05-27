"use client"

import Navbar from "@/components/navbar";
import Image from "next/image";
import {useState} from "react";
import garotas from "../../public/imagem_loja.svg"
import escuro from "../../public/telaloja_degrade.svg"
import nome from "../../public/rareBeauty_loja.png"



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

    return(
        <div className = "flex flex-col min-h-screen bg-black">
            <Navbar/> 
            <div className="relative">
            <Image src={escuro} alt = { "escuro"} 
            height={10}
            width={10000}
            className="absolute z-10 top-0 left-0"
            ></Image>

            <Image src={garotas} alt={"Garotas"}
            height={10}
            width={10000}></Image>
            className= "relative z-0"
            </div>

            <div className = "w-full min-h-screen items-center justify-center ">
                <Image src={nome} alt={"nome"}></Image>
            </div>
        </div>
    )
}