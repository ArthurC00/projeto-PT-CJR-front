"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import Navbar from "../../components/navbar";
import ProductStars from "@/components/productStart";
import EditarPerfil from "../profile/components/editar-perfil";
import nonProfile from "../../public/profile/nonProfile.png";
import emailIcon from "../../public/profile/iconEmail.svg";
import { decodeUserToken } from "../utils/auth";
import { getOneUser } from "../services/usersApi";
import { getProductByUserId } from "../services/productApi";
import { LojaUsuarioResponse } from "../types/lojaTypes";
import { getLojasByUserId } from "../services/lojaApi";
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

  const [openEditarPerfil, setOpenEditarPerfil] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);

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

  useEffect(() => {
    if (!userId) return;

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
      } catch (error) {
        setPageNotFound(true);
      }
    };

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
  const handleAddProduct = () => setOpenAddProductModal((prev) => !prev);

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

  return (
    <div className="z-0 min-h-screen bg-[#F6F3E4] text-black overflow-y-auto pb-20">
      <Navbar />

      <div className="bg-black h-[357px] w-full relative"></div>

      <div className="max-w-[1210px] mx-auto px-4 md:px-0">
        <section className="-mt-32 relative z-10 flex flex-col md:flex-row items-start gap-8 mb-16">
          <button
            className="mt-10 text-white hover:scale-105 transition-transform"
            onClick={() => router.back()}
          >
            <ChevronLeft size={60} strokeWidth={2.5} />
          </button>

          <div className="w-[230px] h-[230px] rounded-full overflow-hidden border-4 border-[#F6F3E4] bg-white shadow-lg">
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

          <div className="pt-36">
            <h1 className="text-[52px] font-medium leading-[48px] text-black">
              {userData?.nome}
            </h1>
            <h2 className="text-[29px] font-light text-black/60 mt-1">
              @{userData?.username}
            </h2>
            <h3 className="flex items-center text-[29px] font-light text-black/60 gap-2 w-5 h-auto">
              <Image src={emailIcon} alt="Email" />
              {userData?.email}
            </h3>
          </div>

          {isOwner && (
            <div className="mt-10 md:ml-auto md:self-center grid-cols-2 gap-3">
              <button
                className="w-[324px] h-[43.32px] bg-purple-600 text-white rounded-full font-medium hover:scale-102 transition"
                onClick={handleEditarPerfil}
              >
                Editar Perfil
              </button>
            </div>
          )}
        </section>

        <div className="z-10 flex flex-col gap-[60px]">
          {userProducts && userProducts.length > 0 && (
            <section>
              <h2 className="flex items-center justify-between text-[36px] font-medium text-black mb-6">
                Produtos
              </h2>
              <div className="flex gap-8 p-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none [&::-webkit-scrollbar]:hidden">
                {userProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-[228px] h-[310px] bg-white rounded-[35px] p-5 flex flex-col justify-between flex-shrink-0 shadow-sm relative hover:scale-101 cursor-pointer"
                    onClick={() => router.push(`/produto/${product.id}`)}
                  >
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative ">
                      {product.loja?.banner_url ? (
                        <Image
                          src={product.loja.banner_url}
                          alt="Banner da Loja"
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="w-full h-[150px] bg-gray-100 rounded-[12px] flex items-center justify-center overflow-hidden">
                      {product.imagens && product.imagens.length > 0 ? (
                        <Image
                          src={product.imagens[0].url_imagem}
                          alt={`Imagem de ${product.nome || "Produto"}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Foto do Produto
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      <h4 className="text-[24px] font-medium text-black truncate leading-tight">
                        {product.nome}
                      </h4>
                      <p className="text-[21px] font-medium text-black mt-1">
                        {`R$ ${Number(product.preco).toFixed(2)}`}
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

          {minhasLojas &&
            Array.isArray(minhasLojas) &&
            minhasLojas.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[36px] font-medium text-black">Lojas</h2>
                  {isOwner && (
                    <button
                      className="w-[38.27px] h-[38.27px] bg-purple-600 text-white rounded-full flex items-center justify-center hover:scale-102 transition"
                      onClick={handleAddProduct}
                    >
                      <Plus />
                    </button>
                  )}
                </div>
                <div className="flex gap-8 p-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none [&::-webkit-scrollbar]:hidden">
                  {minhasLojas.map((loja, index) => (
                    <div
                      className="flex w-full max-w-[606px] h-[186px] bg-white rounded-[23px] p-8 flex justify-between items-center shadow-sm"
                      key={index}
                      onClick={() => {
                        router.push(`/loja/${loja.id}`);
                      }}
                    >
                      <div>
                        <h3 className="text-[55px] font-light leading-[51px] pb-4 text-black">
                          {loja.nome}
                        </h3>
                        <span className="text-[44px] font-normal text-[#6A38F3] leading-[41px]">
                          {loja.descricao}
                        </span>
                      </div>
                      {loja.banner_url ? (
                        <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden">
                          <Image
                            src={loja.banner_url}
                            alt="Banner da Loja"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-[120px] h-[120px] rounded-full bg-gray-200 overflow-hidden"></div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          <section className="max-w-[930px]">
            <h2 className="text-[36px] font-medium text-black mb-6">
              Avaliações
            </h2>
            <div className="w-full bg-white rounded-[31px] p-8 flex flex-col md:flex-row gap-6 shadow-sm relative">
              <div className="w-[120px] h-[120px] rounded-full bg-gray-300 flex-shrink-0 overflow-hidden relative">
                <Image
                  src={nonProfile}
                  alt="Avaliador"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className="text-[28px] font-normal text-black">
                    Selena Gomez
                  </h4>
                  <div className="flex bg-slate-50 p-2 rounded-md gap-1 text-[#FFEB3A] items-center">
                    <ProductStars rating={3} />
                  </div>
                </div>
                <p className="text-[24px] font-extralight text-black text-justify mt-4 leading-normal">
                  Não é por nada não, mas essa garota arrasa
                </p>
                <div className="text-right mt-2">
                  <button className="text-[24px] font-extralight text-[#8A38F5] hover:underline">
                    ver mais
                  </button>
                </div>
              </div>
            </div>
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
