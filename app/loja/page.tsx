"use client"

import Navbar from "@/components/navbar";
import {useState} from "react";



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
        </div>
    )
}