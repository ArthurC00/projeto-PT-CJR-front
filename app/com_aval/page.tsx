"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/modal";
import {
  deleteReviewById,
  deleteReviewCommentById,
  getReviewById,
  getReviewCommentByReviewId,
  postReviewCommentByReviewId,
  updateReviewById,
  updateReviewCommentById,
} from "../services/lojaApi";
import { decodeUserToken } from "../utils/auth";
import {
  LojaDetalhesResponse,
  LojaReviewRequest,
  LojaReviewResponse,
  ReviewCommentRequest,
  ReviewCommentResponse,
} from "../types/lojaTypes";
import Image from "next/image";
import editReviewCommentSVG from "../../public/editReviewComment.svg";

function ComAvalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathname = usePathname();

  const query = searchParams.toString();
  const urlComplete = query ? `${pathname}?${query}` : pathname;
  const returnTo = encodeURIComponent(urlComplete);

  // infos vindas da URL
  const reviewId = Number(searchParams.get("id"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const [novaResposta, setNovaResposta] = useState("");

  // Estado da avaliação atual
  const [avaliacao, setAvaliacao] = useState<LojaReviewResponse>();
  const [reviewComments, setReviewComments] =
    useState<ReviewCommentResponse[]>();
  const [userData, setUserData] = useState<UserDataProps | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [commentId, setCommentId] = useState<number>(0);

  // Estados temporários para controlar o formulário dentro do Modal
  const [textoTemporario, setTextoTemporario] = useState("");
  const [estrelasTemporarias, setEstrelasTemporarias] = useState<number>(0);
  const [hoverEstrelas, setHoverEstrelas] = useState<number | null>(null); // Efeito visual de hover

  const fetchPageData = async () => {
    try {
      const [reviewData, reviewComments] = await Promise.all([
        getReviewById(reviewId),
        getReviewCommentByReviewId(reviewId),
      ]);
      setAvaliacao(reviewData);
      setReviewComments(reviewComments);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserData = () => {
    const token = localStorage.getItem("token");
    const data = decodeUserToken(token);
    setUserData(data);
  };

  useEffect(() => {
    if (reviewId) fetchPageData();
    if (localStorage.getItem("token")) {
      getUserData();
    }
  }, [reviewId]);

  const lidarComEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!novaResposta.trim() || !avaliacao || !userData) return;

    const newComment: ReviewCommentRequest = {
      usuario_id: userData?.userId,
      conteudo: novaResposta,
      avaliacao_loja_id: reviewId,
      avaliacao_produto_id: null,
    };

    try {
      await postReviewCommentByReviewId(newComment);
      fetchPageData();
    } catch (e) {
      console.error(e);
    } finally {
      setNovaResposta("");
    }
  };

  const handleUpdate = async () => {
    if (!avaliacao || !reviewId) return;

    const newReview: Pick<LojaReviewRequest, "nota" | "comentario"> = {
      nota: estrelasTemporarias,
      comentario: textoTemporario,
    };

    try {
      await updateReviewById(reviewId, newReview);
      fetchPageData();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar alteração.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!newComment || !reviewId || commentId == 0) return;

    const commentNew: Pick<ReviewCommentRequest, "conteudo"> = {
      conteudo: newComment,
    };

    try {
      await updateReviewCommentById(commentId, commentNew);
      fetchPageData();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar alteração.");
    } finally {
      setCommentId(0);
      setNewComment("");
      setIsCommentModalOpen(false);
    }
  };

  const handleDeletar = async () => {
    if (!reviewId) return;

    if (confirm("Tem certeza absoluta que deseja deletar sua avaliação?")) {
      try {
        await deleteReviewById(reviewId);
        alert("Avaliação deletada.");
        router.push(`/loja/${avaliacao?.loja_id}`);
      } catch (error) {
        alert("Erro ao deletar avaliação");
        console.error(error);
      } finally {
        setTextoTemporario("");
        setIsModalOpen(false);
      }
    }
  };

  const handleDeletarComment = async () => {
    if (!reviewId || commentId == 0) return;

    if (confirm("Tem certeza absoluta que deseja deletar seu comentário?")) {
      try {
        await deleteReviewCommentById(commentId);
        alert("Comentário deletado.");
        fetchPageData();
      } catch (error) {
        alert("Erro ao deletar avaliação");
        console.error(error);
      } finally {
        setCommentId(0);
        setNewComment("");
        setIsCommentModalOpen(false);
      }
    }
  };

  useEffect(() => {}, [reviewId]);

  return (
    <div className="min-h-screen bg-[#F6F3E4] overflow-x-auto flex flex-col">
      <Navbar />

      <div className="bg-black w-full pt-24 pb-12 flex flex-col items-center justify-start px-4">
        <div className="bg-[#F6F3E4] text-black p-6 rounded-2xl w-full max-w-[600px] shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 bg-neutral-300 rounded-full overflow-hidden flex items-center justify-center font-bold text-neutral-600">
              {avaliacao?.usuario.foto_perfil_url ? (
                <Image
                  src={avaliacao.usuario.foto_perfil_url}
                  alt={`Foto de perfil de ${avaliacao.usuario.nome}`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{avaliacao?.usuario.nome?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-lg">
                {avaliacao?.usuario.nome}
              </h3>
              <span className="text-xs text-neutral-500">
                Avaliação enviada
              </span>
            </div>

            {/* Mostra as estrelas atualizadas do estado atualizado */}
            <div className="text-amber-400 font-bold text-lg">
              {"★".repeat(avaliacao ? avaliacao.nota : 0)}
            </div>
          </div>

          <p className="w-full italic text-gray-800 break-words">
            {avaliacao
              ? `${avaliacao.comentario}`
              : "Esta avaliação foi deletada."}
          </p>

          {userData?.userId === avaliacao?.usuario_id && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
              >
                Quero editar minha avaliação
              </button>
            </div>
          )}
        </div>

        <Link
          href={`/loja/${avaliacao?.loja_id}`}
          className="mt-6 text-sm text-gray-400 hover:underline"
        >
          ← Voltar para a loja
        </Link>
      </div>

      <main className="w-full max-w-[600px] mx-auto px-4 py-8 flex-1 flex flex-col gap-6">
        {userData ? (
          <form onSubmit={lidarComEnvio} className="flex flex-col gap-3">
            <label className="text-black font-semibold text-sm">
              Responder esta avaliação:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={novaResposta}
                onChange={(e) => setNovaResposta(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="flex-1 p-3 rounded-xl border border-neutral-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              <button
                type="submit"
                className="bg-black text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors"
              >
                Responder
              </button>
            </div>
          </form>
        ) : (
          <div className="flex w-[600px] p-2 rounded-xl flex-col items-center justify-center gap-4 text-center">
            <div className="text-[#F6F3E4]/80 text-black">
              Faça login para comentar
            </div>
            <button
              onClick={() => router.push(`/login?returnTo=${returnTo}`)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all text-sm shadow-lg transform hover:scale-105"
            >
              Login
            </button>
          </div>
        )}

        <hr className="border-neutral-300 my-2" />

        {reviewComments ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-black">
              Respostas ({reviewComments.length})
            </h2>

            {reviewComments.map((resp) => (
              <div
                key={resp.id}
                className="flex gap-4 items-center bg-white text-black p-4 rounded-xl shadow-sm border border-neutral-200 ml-6 relative before:content-[''] before:absolute before:left-[-14px] before:top-6 before:w-3 before:h-[2px] before:bg-neutral-300"
              >
                {/* 1. Adicionado 'shrink-0' para o avatar não ser espremido */}
                <div className="shrink-0 w-12 h-12 bg-neutral-300 rounded-full overflow-hidden flex items-center justify-center font-bold text-neutral-600">
                  {resp?.usuario.foto_perfil_url ? (
                    <Image
                      src={resp.usuario.foto_perfil_url}
                      alt={`Foto de perfil de ${resp.usuario.nome}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{resp?.usuario.nome?.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between ">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-neutral-800 truncate">
                        {resp.usuario.nome}
                      </span>
                      {userData?.userId === resp.usuario_id ? (
                        <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full shrink-0">
                          Resposta
                        </span>
                      ) : null}
                    </div>
                    {userData?.userId === resp.usuario_id ? (
                      <p
                        onClick={(e) => {
                          setNewComment(resp.conteudo);
                          (setCommentId(resp.id), setIsCommentModalOpen(true));
                        }}
                      >
                        <Image
                          src={editReviewCommentSVG}
                          alt="Editar comentário"
                          width={12}
                        />
                      </p>
                    ) : null}
                  </div>

                  <p className="w-full break-words text-gray-700 text-sm">
                    {resp.conteudo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </main>

      {/* modal */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          width="max-w-md"
          height="auto"
        >
          <div className="text-black font-sans w-full h-full pt-4">
            <h2 className="text-xl text-center font-normal text-[#2D2D2D] mt-4 mb-4">
              Você está avaliando{" "}
              <span className="font-semibold">{avaliacao?.loja.nome}</span>
            </h2>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => {
                const devePreencher =
                  hoverEstrelas !== null
                    ? star <= hoverEstrelas
                    : star <= estrelasTemporarias;

                return (
                  <svg
                    key={star}
                    onClick={() => setEstrelasTemporarias(star)}
                    onMouseEnter={() => setHoverEstrelas(star)}
                    onMouseLeave={() => setHoverEstrelas(null)}
                    className={`w-10 h-10 text-[#A880FF] stroke-current stroke-1 cursor-pointer transition-colors ${
                      devePreencher ? "fill-[#A880FF]" : "fill-none"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                );
              })}
            </div>

            <textarea
              className="w-full p-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white focus:outline-none text-xs"
              value={textoTemporario}
              onChange={(e) => setTextoTemporario(e.target.value)}
              placeholder="Avaliação da loja"
              rows={6}
            />

            <div className="flex flex-col gap-3 mt-8 items-center w-full">
              <button
                onClick={handleDeletar}
                className="w-[85%] bg-[#E53E2E] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Deletar
              </button>

              <button
                onClick={handleUpdate}
                className="w-[85%] bg-[#633BFA] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Salvar
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isCommentModalOpen && (
        <Modal
          onClose={() => setIsCommentModalOpen(false)}
          width="max-w-md"
          height="auto"
        >
          <div className="text-black font-sans w-full h-full pt-4">
            <h2 className="text-xl text-center font-normal text-[#2D2D2D] mt-4 mb-4">
              Você está editando seu comentário
            </h2>

            <textarea
              className="w-full p-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white focus:outline-none text-xs"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Seu comentário"
              rows={6}
            />

            <div className="flex flex-col gap-3 mt-8 items-center w-full">
              <button
                onClick={handleDeletarComment}
                className="w-[85%] bg-[#E53E2E] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Deletar
              </button>

              <button
                onClick={handleUpdateComment}
                className="w-[85%] bg-[#633BFA] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Salvar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function com_aval() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ComAvalContent />
    </Suspense>
  );
}
