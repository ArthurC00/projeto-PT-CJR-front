import { PostCreateProduct } from "@/app/services/productApi";
import Modal from "@/components/modal";
import { error } from "console";
import { Camera, Plus, Minus, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AdicionarProdutoProps {
  onClose: () => void;
  height?: string;
  width?: string;
  loja_id?: string;
}

export default function AdicionarProduto({
  onClose,
  height = "90vh",
  width = "90vw",
  loja_id = "2",
}: AdicionarProdutoProps) {
  const [quantidade, setQuantidade] = useState(1);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    formData.append("estoque", quantidade.toString());

    if (!loja_id) throw new Error("Id não encontrado");
    formData.append("loja_id", loja_id);

    try {
      const result = await PostCreateProduct(formData);
      console.log("Produto criado com sucesso!", result);
      onClose();
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      alert(error.message || "Erro ao criar produto.");
    }
  };

  return (
    <Modal onClose={onClose} height={height} width={width}>
      {/* Container Principal: Usa flex flex-col e h-full para distribuir o espaço SEM SCROLL */}
      <div className="w-full h-full flex flex-col items-center font-['League_Spartan'] text-black py-2">
        <h1 className="text-[32px] md:text-[42px] leading-tight font-normal mb-2 text-center shrink-0">
          Adicionar Produto
        </h1>

        <form
          id="adicionar-produto"
          onSubmit={handleSave}
          className="w-full max-w-[826px] flex flex-col flex-1 min-h-0 justify-between gap-3"
        >
          <div className="flex flex-col gap-3 shrink-0">
            <label className="w-full h-[15vh] max-h-[140px] border-2 border-dashed border-[#6A38F3] rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#6A38F3]/5 transition-colors group">
              <input
                type="file"
                multiple
                className="hidden"
                name="fotos_principais"
              />
              <div className="relative flex items-center justify-center w-[60px] h-[60px] mb-1">
                <Camera size={50} color="#6A38F3" strokeWidth={1.5} />
                <div className="absolute bottom-0 -right-2 w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Plus size={16} color="#6A38F3" strokeWidth={3} />
                </div>
              </div>
              <span className="text-[18px] md:text-[22px] font-light text-black">
                Anexe as fotos do seu produto
              </span>
            </label>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <label
                  key={item}
                  className="h-[12vh] max-h-[100px] border-2 border-dashed border-[#6A38F3] rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#6A38F3]/5 transition-colors group"
                >
                  <input
                    type="file"
                    className="hidden"
                    name={`foto_secundaria_${item}`}
                  />
                  <div className="relative flex items-center justify-center w-[50px] h-[50px]">
                    <Camera size={40} color="#6A38F3" strokeWidth={1.5} />
                    <div className="absolute bottom-0 -right-2 w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Plus size={14} color="#6A38F3" strokeWidth={3} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Inputs de Texto: flex-1 para a Textarea absorver o espaço dinamicamente */}
          <div className="flex flex-col gap-3 mt-2 flex-1 min-h-0">
            <input
              name="nome"
              placeholder="Nome do produto"
              className="w-full shrink-0 h-[45px] md:h-[55px] bg-white rounded-full px-6 text-[20px] font-light text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#6A38F3]"
              required
            />

            <div className="relative w-full shrink-0">
              <select
                name="categoria_id"
                className="w-full h-[45px] md:h-[55px] bg-white rounded-full px-6 text-[20px] font-light text-black/50 outline-none appearance-none focus:ring-2 focus:ring-[#6A38F3] cursor-pointer"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Subcategoria
                </option>
                <option value="2">Doces</option>
                <option value="2">Bebidas</option>
                <option value="2">Salgados</option>
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
              className="w-full flex-1 min-h-[60px] bg-white rounded-[20px] px-6 py-4 text-[20px] font-light text-black placeholder:text-black/50 outline-none resize-none focus:ring-2 focus:ring-[#6A38F3]"
              required
            ></textarea>

            <input
              name="preco"
              type="number"
              step="0.01"
              placeholder="Preço do produto"
              className="w-full shrink-0 h-[45px] md:h-[55px] bg-white rounded-full px-6 text-[20px] font-light text-black placeholder:text-black/50 outline-none focus:ring-2 focus:ring-[#6A38F3]"
              required
            />
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0 mt-2">
            {/* Controlador de Qtde */}
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

            {/* Botão de Adicionar */}
            <button
              form="adicionar-produto"
              type="submit"
              className="w-[300px] md:w-[373px] h-[55px] md:h-[65px] bg-[#6A38F3] text-white text-[22px] rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:opacity-90 hover:scale-105 transition-all"
            >
              Adicionar Produto
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
