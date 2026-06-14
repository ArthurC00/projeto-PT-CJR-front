'use client';

import { useState } from "react";
import Modal from "@/components/modal";

export default function TesteModais() {
    const [modalAberto, setModalAberto] = useState(false);
    
    return (
        <main className="w-screen h-screen bg-gray-500">
            <div className="flex justify-center self-center">
                <button onClick={() => setModalAberto(true)}>ABRIR MODAL</button>
            </div>
            {modalAberto ? 
                // função que mostra o modal se ele for aberto, e nada se ele for fechado
                <Modal onClose={() => setModalAberto(false)}>
                    <div className="text-black">
                        <p>Conteúdo do Modal</p>
                    </div>
                </Modal>
            : null}
        </main>
    );
}