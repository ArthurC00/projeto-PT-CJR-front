import { ReactNode } from "react";
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
            <div>
                <button onClick={onClose}>FECHAR MODAL</button>
                <div>
                    {children} {/* aqui é onde vai o conteúdo do modal, armazenado em children */}
                </div>
            </div>
        )
    }
}