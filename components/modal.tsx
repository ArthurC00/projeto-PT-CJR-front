import { ReactNode } from "react";
import Image from "next/image";

// esse aqui é um template de modal reutilizável que eu criei pra usar nos modais "editar perfil" e "alterar senha"

interface modalTemplate {
    isOpen: boolean; // true = modal aberto (mostrar); false = modal fechado (esconder);
    onClose: () => void; // só aceita uma função com retorno vazio (serve para fechar o modal)
    children: ReactNode; // ReactNode é o tipo de variável que recebe o conteúdo do modal (HTML, CSS ou qualquer coisa que o React aceite)
}

export default function Modal({ isOpen, onClose, children}: modalTemplate) {
    // passa os parâmetros estabelecidos no template para a função modal
    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
                <div className="relative flex items-center justify-center h-[85vh] w-[35vw] p-8 justify-self-center self-center text-black rounded-4xl bg-[#EDEDED]">
                    <button 
                    onClick={onClose}
                    className="w-1/20 h-auto absolute top-8 right-8">
                        <Image
                            className="w-full h-auto"
                            width={512}
                            height={512}
                            src="/images/botao_fechar.png"
                            alt="Fechar"
                        />
                    </button>
                    <div className="w-full h-full justify-items-center items-center">
                        {children} {/* aqui é onde vai o conteúdo do modal, armazenado em children */}
                    </div>
                </div>
            </div>
        )
    }
}