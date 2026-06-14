"use client";

import Modal from "@/components/modal";
import { Camera, Plus, Minus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteProduct, PatchEditProduct } from "@/app/services/productApi";

interface EditarProdutoProps {
  onClose: () => void;
  produtoData: {
    id: number;
    nome: string;
    categoria_id: number | string;
    descricao: string;
    preco: number | string;
    estoque: number;
    // O Prisma retorna um array de objetos. Ajuste a tipagem conforme o seu banco
    imagens?: { url_imagem: string }[];
  };
}

export default function EditarProduto({
  onClose,
  produtoData,
}: EditarProdutoProps) {
  const router = useRouter();
  const [quantidade, setQuantidade] = useState(produtoData.estoque || 1);

  // 1. Extraímos as URLs das imagens que já vieram do banco de dados
  const imagensAtuais = produtoData.imagens?.map((img) => img.url_imagem) || [];

  // 2. Criamos os estados para as imagens. Posição 0 é a principal. 1, 2 e 3 são as secundárias.
  const [previewPrincipal, setPreviewPrincipal] = useState<string | null>(
    imagensAtuais[0] || null,
  );
  const [previewsSecundarias, setPreviewsSecundarias] = useState<
    (string | null)[]
  >([
    imagensAtuais[1] || null,
    imagensAtuais[2] || null,
    imagensAtuais[3] || null,
  ]);

  // 3. Funções para ler o arquivo do computador e mostrar a foto nova na hora
  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewPrincipal(URL.createObjectURL(file));
    }
  };

  const handleSecundariaChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const novasPreviews = [...previewsSecundarias];
      novasPreviews[index] = URL.createObjectURL(file);
      setPreviewsSecundarias(novasPreviews);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("estoque", quantidade.toString());

    const imagensAtuais = [previewPrincipal, ...previewsSecundarias];

    imagensAtuais.forEach((img) => {
      if (img && !img.startsWith("blob:")) {
        formData.append("imagens_mantidas", img);
      }
    });

    try {
      await PatchEditProduct(produtoData.id, formData);
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao editar produto:", error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Tem certeza que deseja deletar este produto? Essa ação não pode ser desfeita.",
    );
    if (!confirm) return;

    try {
      await DeleteProduct(produtoData.id);
      onClose();
      router.push("/");
    } catch (error: any) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <Modal onClose={onClose} height="90vh" width="min(1020px, 90vw)">
      <div className="w-full h-full flex flex-col items-center font-['League_Spartan'] text-black py-2">
        <h1 className="text-[32px] md:text-[42px] leading-tight font-normal mb-2 text-center shrink-0">
          Editar Produto
        </h1>

        <form
          id="editar-produto"
          onSubmit={handleSave}
          className="w-full max-w-[826px] flex flex-col flex-1 min-h-0 justify-between gap-3"
        >
          {/* SEÇÃO DE FOTOS ATUALIZADA */}
          <div className="flex flex-col gap-3 shrink-0">
            {/* FOTO PRINCIPAL */}
            <label className="w-full h-[15vh] max-h-[140px] border-2 border-dashed border-[#6A38F3] rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#6A38F3]/5 transition-colors group relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="fotos_principais"
                onChange={handlePrincipalChange}
              />

              {/* Se tiver imagem (do banco ou recém escolhida), mostra ela */}
              {previewPrincipal ? (
                <>
                  <img
                    src={previewPrincipal}
                    alt="Foto Principal"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay escura que aparece quando passa o mouse pra indicar que pode trocar */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera color="white" size={40} />
                  </div>
                </>
              ) : (
                // Se não tiver imagem, mostra o ícone de adicionar
                <>
                  <div className="relative flex items-center justify-center w-[60px] h-[60px] mb-1">
                    <Camera size={50} color="#6A38F3" strokeWidth={1.5} />
                    <div className="absolute bottom-0 -right-2 w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Plus size={16} color="#6A38F3" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-[18px] md:text-[22px] font-light text-black">
                    Alterar as fotos do seu produto
                  </span>
                </>
              )}
            </label>

            {/* FOTOS SECUNDÁRIAS */}
            <div className="grid grid-cols-3 gap-4">
              {previewsSecundarias.map((preview, index) => (
                <label
                  key={index}
                  className="h-[12vh] max-h-[100px] border-2 border-dashed border-[#6A38F3] rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#6A38F3]/5 transition-colors group relative overflow-hidden"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    name={`foto_secundaria_${index + 1}`}
                    onChange={(e) => handleSecundariaChange(index, e)}
                  />

                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt={`Foto Secundária ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera color="white" size={30} />
                      </div>
                    </>
                  ) : (
                    <div className="relative flex items-center justify-center w-[50px] h-[50px]">
                      <Camera size={40} color="#6A38F3" strokeWidth={1.5} />
                      <div className="absolute bottom-0 -right-2 w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Plus size={14} color="#6A38F3" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Restante dos Inputs e Botões continua idêntico... */}
          <div className="flex flex-col gap-3 mt-2 flex-1 min-h-0">
            <input
              name="nome"
              placeholder="Nome do produto"
              defaultValue={produtoData.nome}
              className="w-full shrink-0 h-[45px] md:h-[55px] bg-white rounded-full px-6 text-[20px] font-light text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#6A38F3]"
              required
            />
            <div className="relative w-full shrink-0">
              <select
                name="categoria_id"
                defaultValue={produtoData.categoria_id}
                className="w-full h-[45px] md:h-[55px] bg-white rounded-full px-6 text-[20px] font-light text-black/50 outline-none appearance-none focus:ring-2 focus:ring-[#6A38F3] cursor-pointer"
                required
              >
                <option value="" disabled>
                  Subcategoria
                </option>
                <option value="1">Doces</option>
                <option value="2">Bebidas</option>
                <option value="3">Salgados</option>
              </select>
              <ChevronDown
                className="absolute right-6 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                size={24}
                strokeWidth={1.5}
              />
            </div>
            <textarea
              name="descricao"
              placeholder="Descrição do produto"
              defaultValue={produtoData.descricao}
              className="w-full flex-1 min-h-[60px] bg-white rounded-[20px] px-6 py-4 text-[20px] font-light text-black placeholder:text-black/50 outline-none resize-none focus:ring-2 focus:ring-[#6A38F3]"
              required
            ></textarea>
            <input
              name="preco"
              type="number"
              step="0.01"
              placeholder="Preço do produto"
              defaultValue={produtoData.preco}
              className="w-full shrink-0 h-[45px] md:h-[55px] bg-white rounded-full px-6 text-[20px] font-light text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#6A38F3]"
              required
            />
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0 mt-2">
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="w-[50px] h-[50px] border-[2px] border-[#6A38F3] rounded-full flex items-center justify-center hover:bg-[#6A38F3]/10 transition-colors"
              >
                <Minus size={24} color="#6A38F3" strokeWidth={2.5} />
              </button>
              <span className="text-[48px] leading-none text-[#6A38F3] w-[60px] text-center font-normal">
                {quantidade}
              </span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => q + 1)}
                className="w-[50px] h-[50px] border-[2px] border-[#6A38F3] rounded-full flex items-center justify-center hover:bg-[#6A38F3]/10 transition-colors"
              >
                <Plus size={24} color="#6A38F3" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex flex-col md:flex-row w-full justify-center gap-4">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full md:w-[200px] h-[55px] md:h-[65px] bg-[#FF0000] text-white text-[22px] rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:opacity-90 hover:scale-105 transition-all"
              >
                DELETAR
              </button>
              <button
                form="editar-produto"
                type="submit"
                className="w-full md:w-[373px] h-[55px] md:h-[65px] bg-[#6A38F3] text-white text-[22px] rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:opacity-90 hover:scale-105 transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
