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

  return(
    <div className= "flex items-center justify-center min-h-screen bg-gradient-to-n bg-amber-100">
    
    </div>
    
  )

}