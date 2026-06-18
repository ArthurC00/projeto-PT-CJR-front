"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import garotas from "../../public/imagem_loja.svg";
import escuro from "../../public/telaloja_degrade.svg";
import nome from "../../public/rareBeauty_loja.png";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getLojaByLojaId,
  getReviewByLojaId,
  postAddLojaReview,
} from "../services/lojaApi";
import {
  LojaDetalhesResponse,
  LojaReviewRequest,
  LojaReviewResponse,
  LojaUsuarioResponse,
} from "../types/lojaTypes";
import { decodeUserToken } from "../utils/auth";
import { dataFortmatter } from "@/components/utils";

interface TelaLojaProps {
  idLoja: number;
}

export default function LojaPage({ idLoja }: TelaLojaProps) {
  const router = useRouter();

  const [reviews, setReviews] = useState<LojaReviewResponse[]>([]);
  const [inputName, setInputName] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [userSelectedRating, setUserSelectedRating] = useState(5);
  const [lojaDados, setLojaDados] = useState<LojaDetalhesResponse>();
  const [userData, setUserData] = useState<UserDataProps | null>(null);

  // ESTADOS: Autenticação e Controle do Modal e da avaliação.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const urlComplete = query ? `${pathname}?${query}` : pathname;
  const returnTo = encodeURIComponent(urlComplete);

  const carregarLoja = async () => {
    try {
      const [lojaData, reviewData] = await Promise.all([
        getLojaByLojaId(idLoja),
        getReviewByLojaId(idLoja),
      ]);
      setLojaDados(lojaData);
      setReviews(reviewData);
    } catch (error) {
      console.error("Erro ao buscar a loja:", error);
    }
  };

  useEffect(() => {
    if (idLoja) {
      carregarLoja();
    }
  }, [idLoja]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userData = decodeUserToken(token);
      setUserData(userData);
    } else setIsLoggedIn(false);
  }, []);

  const calcularMedia = () => {
    return reviews && reviews.length > 0
      ? reviews.reduce((acc, rev) => acc + rev.nota, 0) / reviews.length
      : 0;
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputComment.trim()) return;

    if (!userData) {
      console.error("Usuário não autenticado ou sem ID!");
      return;
    }

    const newReview: LojaReviewRequest = {
      usuario_id: userData.userId,
      loja_id: idLoja,
      nota: userSelectedRating,
      comentario: inputComment,
    };

    try {
      await postAddLojaReview(newReview);

      setInputName("");
      setInputComment("");
      setUserSelectedRating(5);
      setIsModalOpen(false);

      await carregarLoja();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black min-w-[1200px] overflow-x-auto">
      <Navbar />

      {/* banner  */}
      <div className="relative w-full h-auto overflow-hidden">
        <div className="flex w-full max-h-150 overflow-hidden">
          <Image
            src={lojaDados?.banner_url || escuro}
            alt="Banner da loja"
            width={400}
            height={200}
            className="w-full h-auto relative z-0"
          />
        </div>
        <Image
          src={escuro}
          alt="Degradê escuro"
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="mb-2 text-9xl">{lojaDados?.nome}</div>
          <p className="text-[#F6F3E4]/90 text-lg font-light lowercase tracking-widest -mt-7">
            {lojaDados?.descricao}
          </p>
        </div>
        <p className="absolute bottom-6 right-12 text-[#F6F3E4]/90 text-sm tracking-wide">
          by {lojaDados?.usuario.nome}
        </p>
      </div>

      {/* reviews e média */}
      <div className="bg-black w-full py-12 flex flex-col items-center justify-center gap-6">
        <h2 className="text-[#F6F3E4] text-3xl font-semibold tracking-wide">
          Reviews e Comentários
        </h2>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[#F6F3E4] text-5xl font-bold decoration-1 underline-offset-8">
            {calcularMedia().toFixed(2)}
          </span>
          <StarRating rating={calcularMedia()} />
        </div>

        {/* CONDICIONAL: Mostra o Botão de Avaliar ou o Card de Login */}
        {isLoggedIn ? (
          <div className="w-[600px] mt-6 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all text-sm shadow-lg transform hover:scale-105"
            >
              Deixar uma Avaliação
            </button>
          </div>
        ) : (
          /* Se não estiver autenticado, exibe o incentivo ao login */
          <div className="w-[600px] mt-6 p-8 border border-dashed border-purple-500/30 rounded-xl bg-neutral-900/30 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-[#F6F3E4]/80 text-base">
              Gostou do produto? Faça login com a sua conta para deixar uma
              avaliação.
            </p>
            <button
              onClick={() => router.push(`/login?returnTo=${returnTo}`)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all text-sm shadow-lg transform hover:scale-105"
            >
              Fazer Login para Avaliar
            </button>
          </div>
        )}

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Conteúdo do Modal */}
            <form
              onSubmit={handleAddReview}
              onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro do formulário
              className="w-[600px] p-6 border border-purple-500/20 rounded-xl bg-neutral-900 flex flex-col gap-4 relative shadow-2xl animate-fade-in"
            >
              {/* "X" */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#F6F3E4]/50 hover:text-white text-lg font-bold transition-colors"
              >
                ✕
              </button>

              <h3 className="text-[#F6F3E4] text-xl font-medium mb-2">
                Deixe sua avaliação
              </h3>

              {/* Input do Comentário */}
              <div className="flex flex-col gap-1">
                <label className="text-[#F6F3E4]/70 text-sm">
                  Seu Comentário
                </label>
                <textarea
                  value={inputComment}
                  onChange={(e) => setInputComment(e.target.value)}
                  placeholder="O que você achou da loja e dos produtos?"
                  rows={4}
                  className="bg-black text-[#F6F3E4] border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-sm resize-none"
                />
              </div>

              {/* estrelas e botão enviar */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <span className="text-[#F6F3E4]/70 text-sm">Sua Nota:</span>
                  <StarRating
                    rating={userSelectedRating}
                    onRatingChange={setUserSelectedRating}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-all text-sm shadow-md"
                >
                  Enviar Avaliação
                </button>
              </div>
            </form>
          </div>
        )}

        {/* lista de comentários */}
        <div className="w-[600px] flex flex-col gap-4 mt-8">
          {reviews.map((rev) => (
            <Link
              key={rev.id}
              href={{
                pathname: "/com_aval",
                query: {
                  id: rev.id,
                },
              }}
              className="bg-[#F6F3E4] text-black w-full rounded-2xl block hover:opacity-90 transition-opacity cursor-pointer p-4"
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-300 rounded-full overflow-hidden flex items-center justify-center font-bold text-neutral-600">
                    {rev.usuario.foto_perfil_url ? (
                      <Image
                        src={rev.usuario.foto_perfil_url}
                        alt={`Foto de perfil de ${rev.usuario.nome}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{rev.usuario.nome?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg leading-tight">
                      {rev.usuario.nome}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {dataFortmatter(rev.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <StarRating rating={rev.nota} />
                </div>
              </div>
              <div className="pl-16">
                <p className="text-neutral-700 text-sm leading-relaxed break-words">
                  {rev.comentario}
                </p>
              </div>
            </Link>
          ))}

          {reviews.length === 0 && (
            <p className="text-[#F6F3E4]/50 text-center text-sm italic">
              Nenhuma avaliação ainda. Seja o primeiro!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
