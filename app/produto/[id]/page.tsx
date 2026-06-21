"use client";

import { useState, useEffect, use } from "react";
import {
  getOneProduct,
  getProductsReviewByProductId,
  getProductByUserId,
  postProductReview,
  updateProductReview,
  deleteProductReview,
} from "@/app/services/productApi";
import Navbar from "@/components/navbar";
import ProductStars from "@/components/productStart";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import ProductImages from "../ProductImages";
import OwnerActions from "@/components/ownerActions";
import { ProductResponse, ReviewProduct } from "@/app/types/productTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { decodeUserToken } from "@/app/utils/auth";
import Modal from "@/components/modal";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [productData, setProductData] = useState<ProductResponse>();
  const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewProduct[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [relatedIndex, setRelatedIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);

  const [isLogged, setIsLogged] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverEstrelas, setHoverEstrelas] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = decodeUserToken(token);
        if (decoded) {
          setIsLogged(true);
          setCurrentUserId(decoded.userId);
          if (productData && decoded.userId === productData.loja.usuario_id) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        }
      } catch (e) {
        console.error("Erro ao decodificar token:", e);
      }
    }
  }, [productData]);

  const openReviewModal = () => {
    const userReview = reviews?.find((r) => r.usuario_id === currentUserId);
    if (userReview) {
      setNewRating(userReview.nota);
      setNewComment(userReview.comentario);
    } else {
      setNewRating(5);
      setNewComment("");
    }
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !productData) return;
    if (!newComment.trim()) {
      alert("Por favor, escreva um comentário.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const userReview = reviews?.find((r) => r.usuario_id === currentUserId);

      if (userReview) {
        await updateProductReview(userReview.id, {
          nota: newRating,
          comentario: newComment,
        });
      } else {
        await postProductReview({
          usuario_id: currentUserId,
          produto_id: productData.id,
          nota: newRating,
          comentario: newComment,
        });
      }

      setNewComment("");
      setNewRating(5);
      setIsReviewModalOpen(false);

      const updatedReviews = await getProductsReviewByProductId(id);
      setReviews(updatedReviews);
    } catch (e: any) {
      console.error("Erro ao enviar avaliação:", e);
      alert(e.message || "Ocorreu um erro ao enviar a avaliação.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewDelete = async () => {
    if (!currentUserId || !productData) return;
    const userReview = reviews?.find((r) => r.usuario_id === currentUserId);
    if (!userReview) return;

    if (confirm("Tem certeza absoluta que deseja deletar sua avaliação?")) {
      try {
        setIsSubmittingReview(true);
        await deleteProductReview(userReview.id);
        setNewComment("");
        setNewRating(5);
        setIsReviewModalOpen(false);

        const updatedReviews = await getProductsReviewByProductId(id);
        setReviews(updatedReviews);
      } catch (e: any) {
        console.error("Erro ao deletar avaliação:", e);
        alert(e.message || "Ocorreu um erro ao deletar a avaliação.");
      } finally {
        setIsSubmittingReview(false);
      }
    }
  };

  const fetchPageData = async () => {
    try {
      setIsLoading(true);

      const product = await getOneProduct(id);
      setProductData(product);

      const reviews = await getProductsReviewByProductId(id);
      setReviews(reviews);

      if (product && product.loja.usuario_id) {
        const related = await getProductByUserId(product.loja.usuario_id);
        setRelatedProducts(related || []);
      }
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [id]);

  useEffect(() => {
    if (isLoading) return;

    if (productData) console.log(productData);
  }, [productData, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (productData) return;
    if (countdown === 0) {
      router.push("/feed");
      return;
    }

    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
  }, [isLoading, productData, countdown, router]);

  const handleNextReview = () => {
    if (reviews) {
      const maxIndex = Math.max(0, reviews.length - 2);
      if (reviewIndex < maxIndex) {
        setReviewIndex((prev) => prev + 1);
      }
    }
  };

  const handlePrevReview = () => {
    if (reviewIndex > 0) {
      setReviewIndex((prev) => prev - 1);
    }
  };

  const filteredRelatedProducts = relatedProducts.filter(
    (product) => product.id !== productData?.id,
  );

  const handleNextRelated = () => {
    const maxIndex = Math.max(0, filteredRelatedProducts.length - 2);
    if (relatedIndex < maxIndex) {
      setRelatedIndex((prev) => prev + 1);
    }
  };

  const handlePrevRelated = () => {
    if (relatedIndex > 0) {
      setRelatedIndex((prev) => prev - 1);
    }
  };

  const visibleReviews = reviews
    ? reviews.slice(reviewIndex, reviewIndex + 2)
    : [];
  const visibleRelated = filteredRelatedProducts.slice(
    relatedIndex,
    relatedIndex + 2,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3E4] text-black">
        <h1 className="text-3xl font-bold animate-pulse">
          Carregando produto...
        </h1>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3E4] text-black">
        <h1 className="text-3xl font-bold">Produto não encontrado</h1>
      </div>
    );
  }

  function isUrlValida(url?: string | null) {
    if (!url) return false;
    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/")
    );
  }

  const totalReviews = reviews ? reviews.length : 0;

  const mediaNotas =
    reviews && reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.nota, 0) / reviews.length).toFixed(
          1,
        )
      : "0";

  return (
    <div className="min-h-screen text-black w-full bg-[#F6F3E4] pb-24 overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 lg:px-44 mt-16 flex flex-col lg:flex-row gap-44">
        <ProductImages imagens={productData.imagens} nome={productData.nome} />

        <div className="flex flex-col w-full lg:w-96 relative">
          <div className="flex justify-between items-center gap-2 w-full">
            <h1 className="font-normal text-4xl leading-tight text-black w-80">
              {productData.nome}
            </h1>

            <OwnerActions
              productOwnerId={productData.loja.usuario_id}
              produtoData={productData}
              onClick={() => fetchPageData()}
            />
          </div>

          <div className="flex items-center gap-7 mt-6 whitespace-nowrap">
            {totalReviews > 0 ? (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-sm -mt-1 flex items-center justify-center">
                  <Star fill="#FFEB3A" stroke="#000000" strokeWidth={0.5} />
                </div>
                <span className="flex gap-1 font-light text-lg text-black">
                  <p>{`${mediaNotas} | `}</p>
                  <p> {totalReviews} reviews</p>
                </span>
              </div>
            ) : (
              <p>Ainda não avaliado</p>
            )}
            <span className="font-light text-lg leading-none text-[#6A38F3]">
              {productData.categoria?.nome || ""}
            </span>
            <span className="font-light text-lg leading-none text-[#6A38F3]">
              {productData.estoque} disponíveis
            </span>
          </div>

          <h2 className="font-normal text-4xl leading-tight mt-4">
            R$ {Number(productData.preco).toFixed(2).replace(".", ",")}
          </h2>

          <div className="mt-7">
            <h3 className="font-normal text-xl leading-none">Descrição</h3>
            <div className="w-5 h-1 bg-[#C7C7C7] rounded mt-1 mb-2"></div>

            <p className="font-light text-sm leading-tight text-black whitespace-pre-wrap text-justify">
              {productData.descricao}
            </p>
          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto mt-16 md:mt-28 px-4 md:px-8 lg:px-28 w-full">
        <div className="flex justify-between items-center w-full mb-6 md:mb-8">
          <div className="flex gap-4 items-center">
            <h2 className="font-normal text-3xl md:text-4xl md:leading-tight text-black">
              Avaliações
            </h2>
            {isLogged && !isOwner && (
              <button
                onClick={openReviewModal}
                className="bg-[#6A38F3] text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-all text-sm shadow-md cursor-pointer"
              >
                {reviews?.some((r) => r.usuario_id === currentUserId)
                  ? "Editar minha avaliação"
                  : "Avaliar Produto"}
              </button>
            )}
          </div>
          {reviews && reviews.length > 2 && (
            <div className="flex gap-2">
              <button
                onClick={handlePrevReview}
                disabled={reviewIndex === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center border border-black/10 transition-all ${
                  reviewIndex === 0
                    ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                    : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextReview}
                disabled={reviewIndex >= reviews.length - 2}
                className={`w-10 h-10 rounded-full flex items-center justify-center border border-black/10 transition-all ${
                  reviewIndex >= reviews.length - 2
                    ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                    : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => router.push(`/com_aval?id=${review.id}`)}
                className="w-full bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-sm relative items-center md:items-start text-center md:text-left cursor-pointer hover:scale-101 transition-transform min-h-56 pb-14 md:pb-16"
              >
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gray-300 overflow-hidden relative shadow-inner">
                  {isUrlValida(review.usuario.foto_perfil_url) ? (
                    <Image
                      src={review.usuario.foto_perfil_url!}
                      alt={`Avatar de ${review.usuario.nome}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold text-3xl">
                      {review.usuario.nome?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full text-left flex flex-col min-w-0">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-start flex-wrap gap-2 w-full">
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <h4 className="font-normal text-lg md:text-3xl text-black leading-tight truncate">
                        {review.usuario.nome}
                      </h4>
                    </div>
                    <div className="flex gap-1 text-[#FFEB3A] items-center">
                      <ProductStars rating={review.nota} size={34} />
                    </div>
                  </div>
                  <p className="font-extralight text-sm md:text-xl text-black text-justify mt-4 leading-relaxed break-words line-clamp-3 md:line-clamp-4 pr-0 md:pr-4">
                    {review.comentario}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Nenhuma avaliação foi encontrada para esse produto.
          </p>
        )}
      </section>

      <section className="max-w-7xl mx-auto mt-20 px-8 lg:px-28 w-full">
        <div className="flex justify-between items-center w-full mb-10">
          <h2 className="font-normal text-4xl leading-tight text-black">
            Da mesma loja
          </h2>
          {filteredRelatedProducts.length > 2 && (
            <div className="flex gap-2">
              <button
                onClick={handlePrevRelated}
                disabled={relatedIndex === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center border border-black/10 transition-all ${
                  relatedIndex === 0
                    ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                    : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextRelated}
                disabled={relatedIndex >= filteredRelatedProducts.length - 2}
                className={`w-10 h-10 rounded-full flex items-center justify-center border border-black/10 transition-all ${
                  relatedIndex >= filteredRelatedProducts.length - 2
                    ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                    : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {filteredRelatedProducts.length > 0 ? (
          <div className="flex gap-6 w-full justify-start">
            {visibleRelated.map((product) => (
              <div
                key={product.id}
                className="w-56 h-[310px] bg-white rounded-[35px] p-5 flex flex-col justify-between flex-shrink-0 shadow-sm relative hover:scale-101 cursor-pointer"
                onClick={() => {
                  router.push(`/produto/${product.id}`);
                }}
              >
                <div className="relative w-full h-[150px] bg-gray-100 rounded-[12px] flex items-center justify-center overflow-hidden">
                  {product.imagens && product.imagens.length > 0 ? (
                    <Image
                      src={product.imagens[0].url_imagem}
                      alt={`Imagem de ${product.nome || "Produto"}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">
                      Foto do Produto
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 overflow-hidden z-10">
                  {product.loja?.banner_url ? (
                    <Image
                      src={product.loja.banner_url}
                      alt="Banner da Loja"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>

                <div className="mt-2 text-left">
                  <h4
                    className="text-2xl font-medium text-black truncate leading-tight"
                    title={product.nome}
                  >
                    {product.nome}
                  </h4>
                  <p className="text-xl font-medium text-black mt-1">
                    {`R$ ${Number(product.preco).toFixed(2).replace(".", ",")}`}
                  </p>
                  <span
                    className={`text-sm font-medium block mt-1 ${
                      product.estoque > 0
                        ? "text-[#C6E700]"
                        : "text-[#AF052A]"
                    }`}
                  >
                    {product.estoque > 0 ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Nenhum outro produto encontrado desta loja.
          </p>
        )}
      </section>

      {isReviewModalOpen && (
        <Modal onClose={() => setIsReviewModalOpen(false)}>
          <form onSubmit={handleReviewSubmit} className="text-black font-sans w-80 md:w-96 h-auto pt-4 text-left">
            <h2 className="text-xl text-center font-normal text-[#2D2D2D] mt-4 mb-4">
              Você está avaliando{" "}
              <span className="font-semibold">{productData.nome}</span>
            </h2>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => {
                const devePreencher =
                  hoverEstrelas !== null
                    ? star <= hoverEstrelas
                    : star <= newRating;

                return (
                  <svg
                    key={star}
                    onClick={() => setNewRating(star)}
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
              className="w-full p-4 rounded-xl border border-neutral-200 text-neutral-700 bg-white focus:outline-none text-xs resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva sua opinião sobre o produto..."
              rows={6}
              required
            />

            <div className="flex flex-col gap-3 mt-8 items-center w-full">
              {reviews?.some((r) => r.usuario_id === currentUserId) && (
                <button
                  type="button"
                  onClick={handleReviewDelete}
                  className="w-11/12 bg-[#E53E2E] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Deletar
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-11/12 bg-[#633BFA] text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingReview
                  ? "Enviando..."
                  : reviews?.some((r) => r.usuario_id === currentUserId)
                  ? "Salvar"
                  : "Enviar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
