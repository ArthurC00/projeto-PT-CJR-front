import Modal from "@/components/modal";
import Image from "next/image";
import nonProfile from "../../../public/profile/nonProfile.png";
import { editUser, uploadUserFoto } from "@/app/services/api";
import { EditarUsuario } from "@/app/services/api";
import { useState } from "react";
import AlterarSenha from "./alterar-senha";

export default function EditarPerfil({
  onClose,
  userData,
  height,
  width,
}: any) {
  const [openAlterarSenha, setOpenAlterarSenha] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    try {
      let uploadedUrl = userData.foto_perfil_url;

      if (selectedFile) {
        const uploadRes = await uploadUserFoto(userData.id, selectedFile);
        uploadedUrl = uploadRes.foto_perfil_url;
      }

      const formData = new FormData(formElement);
      const data = Object.fromEntries(formData.entries());

      const usuario: EditarUsuario = {
        nome: data.nome as string,
        username: data.username as string,
        email: data.email as string,
        foto_perfil_url: uploadedUrl,
      };

      await editUser(userData?.id, usuario);
      onClose();
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao salvar perfil.");
    }
  };

  const handleCloseAll = () => {
    setOpenAlterarSenha(false);
    onClose();
  };

  return (
    <Modal onClose={onClose} height={height} width={width}>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col h-1/3 w-full items-center justify-center">
          <Image
            className="outline-5 outline-white rounded-full overflow-hidden h-full w-auto"
            src={previewUrl || userData?.foto_perfil_url || nonProfile}
            alt="Foto de perfil"
            width={225}
            height={225}
            unoptimized
          />
          <input
            type="file"
            id="upload-foto"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="h-1/3 w-auto -mt-4 hover:scale-108 transition"
            onClick={() => document.getElementById("upload-foto")?.click()}
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
        <form
          id="editar-perfil"
          onSubmit={handleSave}
          className="flex flex-col items-center justify-center w-full h-1/3 p-2"
        >
          <input
            name="nome"
            placeholder="Nome"
            defaultValue={userData?.nome || ""}
            aria-label="Nome"
            className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
          />
          <input
            name="username"
            placeholder="Username"
            defaultValue={userData?.username || ""}
            aria-label="Nome de usuário"
            className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={userData?.email || ""}
            aria-label="E-mail"
            className="bg-white text-black rounded-full my-1 h-10 w-3/4 pl-2"
          />
        </form>
        <div className="flex flex-col items-center justify-center w-full h-1/3 p-2">
          <button className="rounded-full my-1 h-10 w-3/4 outline-2 outline-[#AF052A] text-[#AF052A] shadow-md hover:scale-102 transition">
            Deletar Conta
          </button>
          <button
            onClick={() => setOpenAlterarSenha(true)}
            className="rounded-full my-1 h-10 w-3/4 outline-2 outline-[#6A38F3] text-[#6A38F3] shadow-md hover:scale-102 transition"
          >
            Alterar Senha
          </button>
          <button
            form="editar-perfil"
            type="submit"
            className="rounded-full my-1 h-10 w-3/4 outline-4 -outline-offset-2 outline-[#6A38F3] bg-[#6A38F3] text-white shadow-md hover:scale-102 transition"
          >
            Salvar
          </button>
        </div>
      </div>
      {openAlterarSenha ? (
        <AlterarSenha
          onClose={handleCloseAll}
          onBack={() => setOpenAlterarSenha(false)}
          userData={userData}
          height="75vh"
          width="25vw"
        />
      ) : null}
    </Modal>
  );
}
