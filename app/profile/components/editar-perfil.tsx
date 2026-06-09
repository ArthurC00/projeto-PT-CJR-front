import Modal from "@/components/modal";
import Image from "next/image";
import nonProfile from "../../../public/profile/nonProfile.png";
import { editUser } from "@/app/services/api";
import { deleteUser } from "@/app/services/api";
import { EditarUsuario } from "@/app/services/api";
import { useState } from "react";
import AlterarSenha from "./alterar-senha";

export default function EditarPerfil({ onClose, userData, height, width }: any){
    const [openAlterarSenha, setOpenAlterarSenha] = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const usuario: EditarUsuario = {
            nome: data.nome as string,
            username: data.username as string,
            email: data.email as string,
            foto_perfil_url: data.foto_perfil_url as string || userData.foto_perfil_url
        };

        await editUser(userData?.id, usuario);
    }

    const handleCloseAll = () => {
        setOpenAlterarSenha(false); // fecha o alterar senha
        onClose(); // fecha o próprio editar perfil
    }

    const handleDelete = async () => {
        // e.preventDefault();
        // motrar um alerta de confirmação
        const usuarioConfirma = confirm("Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.");

        if (usuarioConfirma) {
            await deleteUser(userData?.id);
        }
        window.location.reload();
    }

    return(
        <Modal onClose={ onClose } height={height} width={width}>
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col h-1/3 w-full items-center justify-center">
                    <Image
                        className="outline-5 outline-white rounded-full overflow-hidden h-full w-auto"
                        src={ userData?.foto_perfil_url || nonProfile }
                        alt="Foto de perfil"
                        width={225}
                        height={225}
                        unoptimized
                    />
                    <button
                        className="h-1/3 w-auto -mt-4 hover:scale-108 transition"
                        // onClick={() => document.getElementById('upload-foto')?.click()} // clica no input de upload da foto quando clicar no ícone de câmera
                    >
                        <div className="w-full h-full p-2 bg-white rounded-full overflow-hidden">
                            <Image 
                            className="w-full h-full"
                            src="/images/icone_camera.png"
                            alt="Foto de perfil"
                            width={38}
                            height={38}
                            />
                        </div>
                    </button>
                </div>
                <form id="editar-perfil" onSubmit={handleSave} className="flex flex-col items-center justify-center w-full h-1/3 p-2">
                    {/*<input
                        type="text"
                        id="upload-foto"
                        // style={{ display: 'none' }} // faz com que o input seja invisível
                        name="foto_perfil_url"
                    />*/}
                    <input
                        name="nome"
                        placeholder="Nome"
                        defaultValue={ userData?.nome || "" }
                        aria-label="Nome"
                        className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                    />
                    <input
                        name="username"
                        placeholder="Username"
                        defaultValue= { userData?.username || "" }
                        aria-label="Nome de usuário"
                        className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        defaultValue= { userData?.email || "" }
                        aria-label="E-mail"
                        className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
                    />
                </form>
                <div className="flex flex-col items-center justify-center w-full h-1/3 p-2">
                    <button onClick={handleDelete} className="rounded-full my-1 h-10 w-3/4 outline-2 outline-[#AF052A] text-[#AF052A] shadow-md hover:scale-102 transition">Deletar Conta</button>
                    <button onClick={() => setOpenAlterarSenha(true)} className="rounded-full my-1 h-10 w-3/4 outline-2 outline-[#6A38F3] text-[#6A38F3] shadow-md hover:scale-102 transition">Alterar Senha</button>
                    <button form="editar-perfil" type="submit" className="rounded-full my-1 h-10 w-3/4 outline-4 -outline-offset-2 outline-[#6A38F3] bg-[#6A38F3] text-white shadow-md hover:scale-102 transition">Salvar</button>
                </div>
            </div>
            { openAlterarSenha ? <AlterarSenha onClose={handleCloseAll} onBack={() => setOpenAlterarSenha(false)} userData={ userData } height="75vh" width="25vw"/> : null }
        </Modal>
    );
}