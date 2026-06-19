import { ReactNode } from "react";
import Image from "next/image";

// esse aqui é um template de modal reutilizável que eu criei pra usar nos modais "editar perfil" e "alterar senha"
// ao usar, precisa passar esses parâmetros na tag de abertura <Modal>:
    // onClose: o que deve acontecer quando clicar no botão "fechar" do modal
    // children: todo o conteúdo HTML, é só colocar assim: <Modal><h1>seu HMTL aqui</h1></Modal>
    // height: altura que a caixinha do modal ocupa na tela (recomendo usar o formato vh, que é uma porcentagem da altura da tela visível)
    // width: largura que a caixinha do modal ocupa na tela (recomendo usar o formato vw, que é uma porcentagem da largura da tela visível)
// se tiver dúvidas pode me mencionar no whatsapp ou no slack!! espero que o template ajude

interface modalTemplate {
    onClose: () => void; // só aceita uma função com retorno vazio (serve para fechar o modal)
    children: ReactNode; // ReactNode é o tipo de variável que recebe o conteúdo do modal (HTML, CSS ou qualquer coisa que o React aceite)
    height?: string; // altura que a caixa do modal deve ocupar
    width?: string; // largura que a caixa do modal deve ocupar
}

export default function Modal({onClose, children, height = "auto", width = "auto"}:modalTemplate) {
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