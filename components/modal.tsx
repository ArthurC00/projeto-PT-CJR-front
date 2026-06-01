import { ReactNode } from "react";
import Image from "next/image";

// esse aqui é um template de modal reutilizável que eu criei pra usar nos modais "editar perfil" e "alterar senha"

interface modalTemplate {
    onClose: () => void; // só aceita uma função com retorno vazio (serve para fechar o modal)
    children: ReactNode; // ReactNode é o tipo de variável que recebe o conteúdo do modal (HTML, CSS ou qualquer coisa que o React aceite)
    height: string;
    width: string;
}

export default function Modal({onClose, children, height, width}:modalTemplate) {
    // passa os parâmetros estabelecidos no template para a função modal
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                    // fundo borrado que fecha o modal ao clicar
                    className="absolute z-10 inset-0 backdrop-blur-xs bg-black/20"
                    onClick={onClose}
                />
                <div className={"relative z-20 flex items-center p-8 rounded-4xl bg-[#EDEDED]"}
                    style={{height: height, width: width}} // altura e largura passadas ao chamar o modal
                    // caixa do modal
                >
                    <button 
                    onClick={onClose}
                    className="pointer-events-auto w-1/20 h-auto absolute top-8 right-8 hover:opacity-50 transition"
                    // botão "fechar"
                    >
                        <Image
                            className="w-full h-auto"
                            width={512}
                            height={512}
                            src="/images/botao_fechar.png"
                            alt="Fechar"
                        />
                    </button>
                    <div className="w-full h-full justify-items-center items-center">
                        {children}
                    </div>
                </div>
            </div>
        )
    }