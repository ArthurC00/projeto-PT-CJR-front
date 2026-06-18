"use client";

import { useState } from "react";

interface ImageProps {
  id: number;
  url_imagem: string;
  ordem: number;
}

interface ProductImagesProps {
  imagens: ImageProps[];
  nome: string;
}

export default function ProductImages({ imagens, nome }: ProductImagesProps) {
  const [imagemPrincipal, setImagemPrincipal] = useState(
    imagens && imagens.length > 0 ? imagens[0].url_imagem : "",
  );

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-2">
        {imagens && imagens.length > 0 ? (
          imagens.map((img, index) => (
            <img
              key={img.url_imagem || index}
              src={img.url_imagem}
              alt={`Imagem ${img.ordem}`}
              onClick={() => setImagemPrincipal(img.url_imagem)}
              className={`w-[131px] h-[131px] object-contain bg-white rounded-[20px] cursor-pointer transition border-2 ${
                imagemPrincipal === img.url_imagem
                  ? "border-[#6A38F3]"
                  : "border-transparent hover:border-gray-200 shadow-sm"
              }`}
            />
          ))
        ) : (
          <div className="w-[131px] h-[131px] bg-gray-300 rounded-[20px]"></div>
        )}
      </div>

      <div className="w-[553px] h-[552px] bg-white rounded-[30px] overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
        {imagemPrincipal ? (
          <img
            src={imagemPrincipal}
            alt={nome}
            className="w-full h-full object-contain p-4 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 font-medium text-lg">
            Sem foto
          </div>
        )}
      </div>
    </div>
  );
}
