"use client";

import { useEffect, useState } from "react";
import { Pen } from "lucide-react";
import { decodeUserToken } from "@/app/utils/auth";
import EditarProduto from "../app/profile/components/editar-produto";

interface OwnerActionsProps {
  productOwnerId: number | undefined;
  produtoData: any;
}

export default function OwnerActions({
  productOwnerId,
  produtoData,
}: OwnerActionsProps) {
  const [isOwner, setIsOwner] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = decodeUserToken(token);
      if (data && data.userId === productOwnerId) {
        setIsOwner(true);
      }
    }
  }, [productOwnerId]);

  if (!isOwner) return null;

  return (
    <>
      <div className="flex items-center gap-[6px] mt-1">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-[27px] h-[27px] bg-[#6A38F3] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          title="Editar Produto"
        >
          <Pen size={14} color="#FFFFFF" strokeWidth={2.5} />
        </button>
      </div>

      {isModalOpen && (
        <EditarProduto
          onClose={() => setIsModalOpen(false)}
          produtoData={produtoData}
        />
      )}
    </>
  );
}
