'use client';

import { useState } from "react";
import Modal from "@/components/modal";

export default function TesteModais() {
    const [modalAberto, setModalAberto] = useState(false);
    
    return (
        <main className="w-screen h-screen bg-gray-500">
            <div className="flex justify-center self-center">
                <button onClick={() => setModalAberto(true)}>ABRIR MODAL</button>
                <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                    <p>Conteúdo do Modal</p>
                </Modal>
            </div>
        </main>
    );
}