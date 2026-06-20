"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Navbar from "../../components/navbar";
import ProductStars from "@/components/productStart";
import EditarPerfil from "../profile/components/editar-perfil";
import { ModalCriarLoja } from "@/components/ModalCriarLoja";
import nonProfile from "../../public/profile/nonProfile.png";
import emailIcon from "../../public/profile/iconEmail.svg";
import { decodeUserToken } from "../utils/auth";
import { getOneUser } from "../services/usersApi";
import { getProductByUserId } from "../services/productApi";
import { LojaUsuarioResponse, LojaReviewResponse } from "../types/lojaTypes";
import { getLojasByUserId, getReviewByLojaId } from "../services/lojaApi";
import { ProductResponse } from "../types/productTypes";

interface ProfilePageProps {
  userId: number;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const router = useRouter();

  const [myId, setMyId] = useState<number>(0);
  const [userData, setUserData] = useState<UserDataProps>();
  const [userProducts, setUserProducts] = useState<ProductResponse[]>([]);
  const [minhasLojas, setMinhasLojas] = useState<LojaUsuarioResponse[] | null>(
    null,
  );
  const [reviews, setReviews] = useState<LojaReviewResponse[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [lojaIndex, setLojaIndex] = useState(0);
  const [openEditarPerfil, setOpenEditarPerfil] = useState(false);
  const [pageNotFound, setPageNotFound] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const isOwner = myId === userId;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = decodeUserToken(token);
      if (data) setMyId(data.userId);
    }
  }, []);

  const loadProfileData = async () => {
    try {
      const [userDataResponse, productsResponse, lojasResponse] =
        await Promise.all([
          getOneUser(userId),
          getProductByUserId(userId),
          getLojasByUserId(userId).catch(() => null),
        ]);

      setUserData(userDataResponse);
      setUserProducts(productsResponse);
      setMinhasLojas(lojasResponse);

      if (lojasResponse && lojasResponse.length > 0) {
        const reviewsPromises = lojasResponse.map((loja) =>
          getReviewByLojaId(loja.id).catch(() => [] as LojaReviewResponse[]),
        );
        const reviewsResults = await Promise.all(reviewsPromises);
        const allReviews = reviewsResults.flat();

        // Ordenar decrescente por data de criação
        allReviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setReviews(allReviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      setPageNotFound(true);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadProfileData();
  }, [userId]);

  useEffect(() => {
    if (!pageNotFound) return;
    if (countdown === 0) {
      router.push("/feed");
      return;
    }

    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [pageNotFound, countdown, router]);

  const handleEditarPerfil = () => setOpenEditarPerfil((prev) => !prev);

  const handleNextReview = () => {
    const maxIndex = Math.max(0, reviews.length - 2);
    if (reviewIndex < maxIndex) {
      setReviewIndex((prev) => prev + 1);
    }
  };

  const handlePrevReview = () => {
    if (reviewIndex > 0) {
      setReviewIndex((prev) => prev - 1);
    }
  };

  const handleNextLoja = () => {
    if (minhasLojas) {
      const maxIndex = Math.max(0, minhasLojas.length - 2);
      if (lojaIndex < maxIndex) {
        setLojaIndex((prev) => prev + 1);
      }
    }
  };

  const handlePrevLoja = () => {
    if (lojaIndex > 0) {
      setLojaIndex((prev) => prev - 1);
    }
  };

  if (pageNotFound) {
    return (
      <div className="min-h-screen bg-[#F6F3E4] text-black overflow-y-auto pb-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Essa conta foi deletada.</h2>
          <p>
            Redirecionando para o feed em {countdown} segundo
            {countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    );
  }

  const visibleReviews = reviews.slice(reviewIndex, reviewIndex + 2);
  const visibleLojas = minhasLojas
    ? minhasLojas.slice(lojaIndex, lojaIndex + 2)
    : [];

  return (
    <div className="z-0 min-h-screen bg-[#F6F3E4] text-black overflow-y-auto pb-20">
      <Navbar />

      <div className="bg-black h-[180px] md:h-[357px] w-full relative"></div>

      <div className="max-w-[1210px] mx-auto px-4 md:px-0">
        <section className="-mt-20 md:-mt-32 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-12 md:mb-16 text-center md:text-left">
          <button
            className="absolute top-4 left-4 text-white hover:scale-105 transition-transform md:relative md:top-0 md:left-0 md:mt-10"
            onClick={() => router.back()}
          >
            <ChevronLeft
              size={40}
              className="md:w-[60px] md:h-[60px]"
              strokeWidth={2.5}
            />
          </button>

          <div className="w-[150px] h-[150px] md:w-[230px] md:h-[230px] rounded-full overflow-hidden border-4 border-[#F6F3E4] bg-white shadow-lg shrink-0">
            <Image
              src={userData?.foto_perfil_url || nonProfile}
              alt="Usuário"
              width={230}
              height={230}
              className="object-cover w-full h-full"
              priority
              unoptimized
            />
          </div>

          <div className="pt-4 md:pt-36 flex flex-col items-center md:items-start">
            <h1 className="text-[32px] md:text-[52px] font-medium leading-tight md:leading-[48px] text-black">
              {userData?.nome}
            </h1>
            <h2 className="text-[18px] md:text-[29px] font-light text-black/60 mt-1">
              @{userData?.username}
            </h2>
            <h3 className="flex items-center justify-center md:justify-start text-[18px] md:text-[29px] font-light text-black/60 gap-2 w-full mt-1">
              <Image
                src={emailIcon}
                alt="Email"
                className="w-[20px] h-[20px] md:w-[29px] md:h-[29px]"
              />
              <span className="truncate">{userData?.email}</span>
            </h3>
          </div>

          {isOwner && (
            <div className="mt-6 md:mt-10 md:ml-auto md:self-center w-full md:w-auto flex justify-center">
              <button
                className="w-full max-w-[324px] md:w-[324px] h-[43.32px] bg-purple-600 text-white rounded-full font-medium hover:scale-102 transition"
                onClick={handleEditarPerfil}
              >
                Editar Perfil
              </button>
            </div>
          )}
        </section>

        <div className="z-10 flex flex-col gap-[40px] md:gap-[60px]">
          {userProducts && userProducts.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-[36px] font-medium text-black mb-6">
                Produtos
              </h2>
              <div className="flex gap-6 md:gap-8 p-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none [&::-webkit-scrollbar]:hidden">
                {userProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-[228px] h-[310px] bg-white rounded-[35px] p-5 flex flex-col justify-between flex-shrink-0 shadow-sm relative hover:scale-101 cursor-pointer"
                    onClick={() => router.push(`/produto/${product.id}`)}
                  >
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
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

                    <div className="relative w-full h-[150px] bg-gray-100 rounded-[12px] flex items-center justify-center overflow-hidden shrink-0">
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

                    <div className="mt-2 text-left">
                      <h4
                        className="text-[24px] font-medium text-black truncate leading-tight"
                        title={product.nome}
                      >
                        {product.nome}
                      </h4>
                      <p className="text-[21px] font-medium text-black mt-1">
                        {`R$ ${Number(product.preco).toFixed(2).replace(".", ",")}`}
                      </p>
                      <span
                        className={`text-[13px] font-medium block mt-1 ${
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
            </section>
          )}

          {(isOwner || (minhasLojas && minhasLojas.length > 0)) && (
            <section className="w-full">
              <div className="flex justify-between items-center mb-6 w-full">
                <h2 className="text-2xl md:text-[36px] font-medium text-black">
                  Lojas
                </h2>
                <div className="flex items-center gap-4">
                  {minhasLojas && minhasLojas.length > 2 && (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevLoja}
                        disabled={lojaIndex === 0}
                        className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border border-black/10 transition-all ${
                          lojaIndex === 0
                            ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                            : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextLoja}
                        disabled={lojaIndex >= minhasLojas.length - 2}
                        className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border border-black/10 transition-all ${
                          lojaIndex >= minhasLojas.length - 2
                            ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                            : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                  {isOwner && (
                    <ModalCriarLoja
                      usuario_id={userId}
                      onSuccess={loadProfileData}
                      trigger={
                        <button className="w-[38.27px] h-[38.27px] bg-purple-600 text-white rounded-full flex items-center justify-center hover:scale-105 hover:bg-purple-700 transition shadow-sm">
                          <Plus size={20} />
                        </button>
                      }
                    />
                  )}
                </div>
              </div>
              {minhasLojas && minhasLojas.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                  {visibleLojas.map((loja, index) => (
                    <div
                      className="flex w-full h-[130px] md:h-[186px] bg-white rounded-[23px] p-4 md:p-6 justify-between items-center shadow-sm cursor-pointer hover:scale-101 transition-transform"
                      key={index}
                      onClick={() => {
                        router.push(`/loja/${loja.id}`);
                      }}
                    >
                      <div className="text-left min-w-0 flex-1 pr-4">
                        <h3
                          className="text-base sm:text-lg md:text-4xl font-light pb-1 md:pb-2 text-black truncate"
                          title={loja.nome}
                        >
                          {loja.nome}
                        </h3>
                        <span
                          className="text-xs sm:text-sm md:text-xl font-normal text-[#6A38F3] truncate block"
                          title={loja.descricao}
                        >
                          {loja.descricao}
                        </span>
                      </div>
                      {loja.logo_url || loja.banner_url ? (
                        <div className="relative w-[60px] h-[60px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden shrink-0 shadow-inner">
                          <Image
                            src={loja.logo_url || loja.banner_url || ""}
                            alt="Logo/Banner da Loja"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] rounded-full bg-gray-200 overflow-hidden shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 italic text-sm text-left w-full">
                  Você ainda não possui nenhuma loja cadastrada.
                </p>
              )}
            </section>
          )}

          <section className="w-full flex flex-col gap-6">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-2xl md:text-[36px] font-medium text-black">
                Avaliações de lojas
              </h2>
              {reviews.length > 2 && (
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevReview}
                    disabled={reviewIndex === 0}
                    className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border border-black/10 transition-all ${
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
                    className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border border-black/10 transition-all ${
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
            {reviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                {visibleReviews.map((review) => (
                  <div
                    key={review.id}
                    className="w-full bg-white rounded-[31.34px] p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-sm relative items-center md:items-start text-center md:text-left cursor-pointer hover:scale-101 transition-transform min-h-[220px] pb-14 md:pb-16"
                    onClick={() => {
                      router.push(`/com_aval?id=${review.id}`);
                    }}
                  >
                    <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full bg-gray-300 flex-shrink-0 overflow-hidden relative shadow-inner">
                      {review.usuario.foto_perfil_url ? (
                        <Image
                          src={review.usuario.foto_perfil_url}
                          alt={`Avatar de ${review.usuario.nome}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold text-3xl">
                          {review.usuario.nome?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full text-left flex flex-col">
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-start flex-wrap gap-2 w-full">
                        <div className="flex flex-col min-w-0 w-full md:w-auto">
                          <h4 className="font-normal text-lg md:text-[28.67px] text-black leading-tight truncate">
                            {review.usuario.nome}
                          </h4>
                          <span className="font-light text-xs md:text-sm text-neutral-400 mt-1 truncate">
                            loja:
                            <span className="font-medium text-[#8A38F5]">
                              {review.loja?.nome}
                            </span>
                          </span>
                        </div>
                        <div className="flex gap-1 text-[#FFEB3A] items-center shrink-0">
                          <ProductStars rating={review.nota} />
                        </div>
                      </div>
                      <p className="font-extralight text-sm md:text-xl text-black text-justify mt-4 leading-[23px] break-words line-clamp-3 md:line-clamp-4 pr-0 md:pr-4">
                        {review.comentario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 italic text-sm text-left w-full">
                Nenhuma avaliação recebida para as lojas deste usuário.
              </p>
            )}
          </section>
        </div>
      </div>

      {openEditarPerfil && (
        <EditarPerfil
          onClose={() => setOpenEditarPerfil(false)}
          userData={userData}
          height="85vh"
          width="35vw"
        />
      )}
    </div>
  );
}
