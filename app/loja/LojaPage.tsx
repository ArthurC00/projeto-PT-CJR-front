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
import createButtonSvg from "@/public/createButton.svg";
import editButtonSvg from "@/public/editButton.svg";
import { ModalEditarLoja } from "@/components/modalEditarLoja";
import AdicionarProduto from "../profile/components/add-product";
import { getProductByLojaId, getProductByUserId } from "../services/productApi";
import { ProductResponse } from "../types/productTypes";

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
  const [isOpenLojaModal, setIsOpenLojaModal] = useState<boolean>(false);
  const [isOpenProductModal, setIsOpenProductModal] = useState<boolean>(false);
  const [produtos, setProdutos] = useState<ProductResponse[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [countdown, setCountdown] = useState(3);

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
      const lojaData = await getLojaByLojaId(idLoja);
      setLojaDados(lojaData);

      const [reviewData, prodData] = await Promise.all([
        getReviewByLojaId(idLoja),
        lojaData?.usuario?.id
          ? getProductByLojaId(lojaData.id)
          : Promise.resolve([]),
      ]);
      setReviews(reviewData);
      setProdutos(prodData);
    } catch (error) {
      console.log("Erro ao buscar a loja:", error);
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

  const isOwner = userData?.userId === lojaDados?.usuario.id;

  const itensPorPagina = 15;
  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
  const produtosPaginados = produtos.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  useEffect(() => {
    if (lojaDados) return;
    if (countdown === 0) {
      router.push("/feed");
      return;
    }

    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [lojaDados, countdown, router]);

  if (!lojaDados) {
    return (
      <div className="min-h-screen bg-[#F6F3E4] text-black overflow-y-auto pb-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">
            Essa loja não existe ou foi deletada.
          </h2>
          <p>
            Redirecionando para o feed em {countdown} segundo
            {countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-black max-w-screen overflow-x-auto">
      <Navbar />

      {/* banner  */}
      <div className="relative w-full h-auto overflow-hidden">
        <div className="relative flex w-full max-h-150 overflow-hidden">
          <Image
            src={lojaDados?.banner_url || escuro}
            alt="Banner da loja"
            width={400}
            height={200}
            className="w-full h-auto object-cover"
          />

          <Image
            src={escuro}
            alt="Degradê escuro"
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          />

          {isOwner && (
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button
                className="p-2 rounded transition-all shadow-lg transform hover:scale-105"
                onClick={() => setIsOpenLojaModal(true)}
              >
                <Image src={editButtonSvg} alt="Editar loja" />
              </button>
              <button
                className="p-2 rounded transition-all shadow-lg transform hover:scale-105"
                onClick={() => setIsOpenProductModal(true)}
              >
                <Image src={createButtonSvg} alt="Adicionar produto" />
              </button>
            </div>
          )}
        </div>
        {isOpenLojaModal && lojaDados && (
          <ModalEditarLoja
            loja={lojaDados}
            onClose={async () => {
              setIsOpenLojaModal(false);
              await carregarLoja();
            }}
          />
        )}
        {isOpenProductModal && lojaDados && (
          <AdicionarProduto
            loja={lojaDados}
            onClose={async () => {
              setIsOpenProductModal(false);
              await carregarLoja();
            }}
          />
        )}

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <div className="mb-2 text-9xl">{lojaDados?.nome}</div>
          <div className="flex flex-col items-center">
            <p className="text-[#F6F3E4]/90 text-lg font-light lowercase tracking-widest">
              {lojaDados?.descricao}
            </p>
            <StarRating rating={calcularMedia()} />
          </div>
        </div>
        <p className="absolute bottom-6 right-12 text-[#F6F3E4]/90 text-sm tracking-wide">
          by {lojaDados?.usuario.nome}
        </p>
      </div>

      {produtos.length > 0 && (
        <div className="bg-[#F6F3E4] w-full py-12 flex flex-col items-center justify-center gap-10 border-b border-[#F6F3E4]/10">
          {/* Título com Alinhamento à Esquerda */}
          <div className="w-full max-w-[1211px] px-4 text-left">
            <h2 className="text-black text-[40px] font-semibold tracking-wide font-['League_Spartan'] flex items-baseline gap-2">
              Produtos{" "}
              <span className="text-[20px] font-extralight lowercase">
                de {lojaDados?.nome}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[17px] justify-items-center w-full max-w-[1211px] px-4">
            {produtosPaginados.map((prod) => {
              const imagemUrl =
                prod.imagens && prod.imagens.length > 0
                  ? prod.imagens.find((img) => img.ordem === 1)?.url_imagem ||
                    prod.imagens[0].url_imagem
                  : null;
              const disponivel = prod.estoque > 0;

              return (
                <div
                  key={prod.id}
                  className="w-[228.68px] h-[310px] bg-white rounded-[35px] flex flex-col justify-between p-[18px] shadow-lg relative text-black hover:scale-102 transition-transform select-none animate-fade-in"
                  onClick={() => router.push(`/produto/${prod.id}`)}
                >
                  <div className="relative w-[190px] h-[160px] mx-auto overflow-hidden rounded-[12px] flex items-center justify-center bg-neutral-50 shrink-0">
                    {imagemUrl ? (
                      <Image
                        src={imagemUrl}
                        alt={prod.nome}
                        fill
                        sizes="190px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-neutral-400 text-xs italic font-light">
                        Sem imagem
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full mt-2 pl-1 pr-1 text-left">
                    <h3
                      className="font-['League_Spartan'] font-medium text-[24px] leading-tight text-black truncate w-full"
                      title={prod.nome}
                    >
                      {prod.nome}
                    </h3>
                    <p className="font-['League_Spartan'] font-medium text-[21px] leading-tight text-black">
                      R$ {Number(prod.preco).toFixed(2)}
                    </p>
                    <span
                      className={`font-['League_Spartan'] font-medium text-[13px] leading-tight mt-1 ${
                        disponivel ? "text-[#C6E700]" : "text-[#AF052A]"
                      }`}
                    >
                      {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-6 mt-4 select-none">
              {/* Seta Esquerda */}
              <button
                onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="disabled:opacity-30 disabled:cursor-not-allowed text-black hover:scale-110 transition-transform p-2 border-2 border-transparent hover:border-black/20 rounded-full"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <div className="flex items-center gap-4">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setPaginaAtual(num)}
                      className={`font-['League_Spartan'] text-[44px] leading-[41px] transition-all ${
                        paginaAtual === num
                          ? "text-black font-medium scale-110"
                          : "text-black/50 font-light hover:text-black"
                      }`}
                    >
                      {num}
                    </button>
                  ),
                )}
              </div>

              {/* Seta Direita */}
              <button
                onClick={() =>
                  setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
                }
                disabled={paginaAtual === totalPaginas}
                className="disabled:opacity-30 disabled:cursor-not-allowed text-black hover:scale-110 transition-transform p-2 border-2 border-transparent hover:border-black/20 rounded-full"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

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
            <form
              onSubmit={handleAddReview}
              onClick={(e) => e.stopPropagation()}
              className="w-[600px] p-6 border border-purple-500/20 rounded-xl bg-neutral-900 flex flex-col gap-4 relative shadow-2xl animate-fade-in"
            >
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
