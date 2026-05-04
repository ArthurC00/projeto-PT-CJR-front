'use client'
import React, {useState} from 'react';

type Task = {
  id: number;
  title: string;
  descriptions: string;
  done: boolean;
  createdAT: string;
  updateAT?: string;
  expanded?: boolean;
};

export default function TodoList(){
  const[tasks, setTasks] = useState<Task[]>([]);

  return (
  <div className="flex items-center justify-center min-h-screen bg-amber-100 p-4">
    
    <div className="w-full max-w-md min-h-[600px] bg-black/90 rounded-3xl p-8 flex flex-col items-center">      
      <h1 className="text-white text-2xl font-bold mb-8">CRIE SUA CONTA</h1>

      
      
    </div>
  </div>
);

}