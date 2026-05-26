"use client"

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
        <div className = "flex items-center justify-center min-h-screen bg-black"></div>
    )
}