import Modal from "@/components/modal";
import Image from "next/image";
import { updatePassword } from "@/app/services/api";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

export default function AlterarSenha({onClose, onBack, userData, width, height }:any){
    const [mostrarSenhaAntiga, setMostrarSenhaAntiga] = useState(false)
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false)
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)
    
    const handleSaveSenha = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const senhaAntiga = formData.get("senha") as string;
        const novaSenha = formData.get("nova_senha") as string;
        const confirmarSenha = formData.get("confirmar_senha") as string;

        if (novaSenha !== confirmarSenha) {
            alert("A nova senha e a confirmação devem ser iguais");
            return;
        }

        if (novaSenha.length < 1) {
            alert("A senha não pode estar vazia")
            return;
        }

        try {
            await updatePassword(userData.id, {senhaAntiga, novaSenha});
            alert("Senha alterada com sucesso");
        } catch (error) {
            alert("Senha antiga incorreta ou erro no servidor");
        }
    }

    return(
        <Modal onClose={onClose} width={width} height={height}>
            <button 
                onClick={onBack}
                className="pointer-events-auto w-1/20 h-auto absolute top-8 left-8 hover:opacity-50 transition"
                // botão "voltar"
            >
                <Image
                    className="w-full h-auto"
                    width={28}
                    height={23}
                    src="/images/botao_voltar.png"
                    alt="Voltar"
                    />
            </button>
            
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col h-1/3 p-4 w-full items-center justify-center">
                    <Image
                        className="w-max h-max"
                        src="/images/chave.png"
                        height={183}
                        width={183}
                        alt="Ícone de chave roxo"
                    />
                </div>
                
                <div className="flex flex-col h-1/3 w-full items-center justify-center">
                    <form 
                        id="alterar-senha" className="flex flex-col items-center justify-center w-full h-full p-2"
                        onSubmit={handleSaveSenha}
                    >
                    
                    <div className="relative flex items-center w-3/4">
                        <input
                            name="senha"
                            type={mostrarSenhaAntiga ? "text" : "password"}
                            placeholder="Senha Antiga"
                            aria-label="Senha antiga"
                            className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenhaAntiga((prev) => !prev)}
                            className="absolute right-3 text-gray-500 hover:text-gray-700">
                            {mostrarSenhaAntiga ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>

                    <div className="relative flex items-center w-3/4">
                        <input
                            name="nova_senha"
                            type={mostrarNovaSenha ? "text" : "password"}
                            placeholder="Nova Senha"
                            aria-label="Nova senha"
                            className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarNovaSenha((prev) => !prev)}
                            className="absolute right-3 text-gray-500 hover:text-gray-700">
                            {mostrarNovaSenha ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>

                    <div className="relative flex items-center w-3/4">
                        <input
                            name="confirmar_senha"
                            type={mostrarConfirmarSenha ? "text" : "password"}
                            placeholder="Confirmar Senha"
                            aria-label="Confirmar senha"
                            className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                            className="absolute right-3 text-gray-500 hover:text-gray-700">
                            {mostrarConfirmarSenha ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                
                </form>

                </div>
                <div className="flex flex-col h-1/3 w-full items-center justify-center">
                    <button form="alterar-senha" type="submit" className="rounded-full my-1 h-10 w-3/4 outline-4 -outline-offset-2 outline-[#6A38F3] bg-[#6A38F3] text-white shadow-md hover:scale-102 transition">Salvar Senha</button>
                </div>
            </div>
        </Modal>
    );
}