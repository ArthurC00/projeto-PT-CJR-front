'use client';

import { use, useState } from "react";
import Modal from "@/components/modal";

export default function testeModais() {
    const [modalAberto, setModalAberto] = useState(false);
    
    return (
        <div>
            <button onClick={() => setModalAberto(true)}>ABRIR MODAL</button>
            <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                <p>O conteúdo do Modal vai aqui!</p>
            </Modal>
        </div>
    );
}