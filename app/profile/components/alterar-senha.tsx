import Modal from "@/components/modal";
import Image from "next/image";
import { updatePassword } from "@/app/services/api";
import { useState } from "react";

export default function AlterarSenha({onClose, onBack, userData, width, height }:any){
    const [ senhaAntiga, setSenhaAntiga ] = useState("");
    const [ novaSenha, setNovaSenha ] = useState("");
    const [ confirmarSenha, setConfirmarSenha ] = useState("");

    const handleSaveSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Valores atuais:", { senhaAntiga, novaSenha }); // Debug        

        if (novaSenha !== confirmarSenha) {
            alert("A nova senha e a confirmação não coincidem");
            return;
        }

        if (novaSenha.length < 1) {
            alert("A senha não pode estar vazia")
            return;
        }

        try {
            await updatePassword(userData.id, {senha_atual: senhaAntiga, nova_senha: novaSenha});
            onClose();
        } catch (error: any) {
            // tenta mostrar a mensagem de erro do servidor e se não conseguir usa uma genérica
            alert(error.response?.data?.message || "Ocorreu um erro ao salvar.");
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
                    <form id="alterar-senha" onSubmit={handleSaveSenha} className="flex flex-col items-center justify-center w-full h-full p-2">
                    <input
                        required
                        value={senhaAntiga}
                        onChange={(e) => setSenhaAntiga(e.target.value)}
                        name="senha"
                        type="password"
                        placeholder="Senha Antiga"
                        aria-label="Senha antiga"
                        className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                    />
                    <input
                        required
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        name="nova_senha"
                        type="password"
                        placeholder="Nova Senha"
                        aria-label="Nova senha"
                        className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                    />
                    <input
                        required
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        name="confirmar_senha"
                        type="password"
                        placeholder="Confirmar Senha"
                        aria-label="Confirmar senha"
                        className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                    />
                </form>
                </div>
                <div className="flex flex-col h-1/3 w-full items-center justify-center">
                    <button form="alterar-senha" type="submit" className="rounded-full my-1 h-10 w-3/4 outline-4 -outline-offset-2 outline-[#6A38F3] bg-[#6A38F3] text-white shadow-md hover:scale-102 transition">Salvar Senha</button>
                </div>
            </div>
        </Modal>
    );
}