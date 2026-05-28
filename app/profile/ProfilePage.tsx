'use client';

import Image from "next/image";
import Navbar from "../../components/navbar";
import nonProfile from "../../public/profile/nonProfile.png";
import emailIcon from "../../public/profile/iconEmail.svg";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft, Star, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOneUser } from "../services/usersApi";
import { decodeUserToken } from "../utils/auth";
import EditarPerfil from "./components/editar-perfil";

interface Product {
  name: string;
  price: string;
  available: boolean;
}

interface ProfilePageProps {
  userId: number;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [editProfileButton, setEditProfileButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState<UserDataProps>();
  const [myId, setMyId] = useState<number>(0);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = decodeUserToken(token);
      if (data) setMyId(data?.userId);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getOneUser(userId);
        setUserData(data);
      } catch (e) {
        setError(true);
        return;
      }
    };
    if (userId) {
      loadData();
    }
  }, [userId]);

  const productStars = (rating: number) => {
    const validRating = Math.min(Math.max(rating, 0), 5);
    return (
      <div className="flex items-center gap-1 text-[#FFEB3A]">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = Math.min(Math.max(validRating - index, 0), 1);
          const scaleSize = starValue > 0 ? Math.max(starValue, 0.5) : 0;

          return (
            <div
              key={index}
              className="w-5 h-5 flex items-center justify-center"
            >
              <div
                className="flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${scaleSize})` }}
              >
                <Star
                  size={20}
                  fill={
                    starValue === 1 ? "#FFEB3A" : "oklch(87.2% 0.01 258.338)"
                  }
                  stroke="#000000"
                  strokeWidth={0.5}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  // Dados dos produtos copiados Figma
  const products: Product[] = [
    { name: "Bronzer", price: "R$254,99", available: true },
    { name: "Blush", price: "R$199,99", available: false },
    { name: "Perfume Rare", price: "R$599,90", available: true },
    { name: "Iluminador", price: "R$249,90", available: true },
    { name: "Mini Blush", price: "R$99,99", available: false },
    { name: "Lapis Labial", price: "R$139,90", available: true },
    { name: "Primer", price: "R$259,90", available: true },
  ];

  const isOwner = myId === userId;

  useEffect(() => {
    setEditProfileButton(isOwner);
  }, [isOwner]);

  const handleModal = () => {
    setOpenModal(!openModal)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F3E4] text-black overflow-y-auto pb-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Essa conta foi deletada.</h2>
          <p>Temos que resolver isso</p>
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
          {editProfileButton && (
            <div className="mt-10 md:ml-auto md:self-center">
              <button
                className="w-[324px] h-[43.32px] bg-purple-600 text-white rounded-full font-medium hover:scale-102 transition"
                onClick={ handleModal }
              >
                Editar Perfil
              </button>
            </div>
          )}
        </section>

        <div className="z-10 flex flex-col gap-[60px]">
          <section>
            <h2 className="text-[36px] font-medium text-black mb-6">
              Produtos
            </h2>
            <div className="flex gap-8 p-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:black_transparent]">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="w-[228px] h-[310px] bg-white rounded-[35px] p-5 flex flex-col justify-between flex-shrink-0 shadow-sm relative hover:scale-101"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover"
                      style={{ backgroundImage: "url" }}
                    />
                  </div>

                  <div className="w-full h-[150px] bg-gray-100 rounded-[12px] flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400 text-xs">
                      Foto do Produto
                    </span>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-[24px] font-medium text-black truncate leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-[21px] font-medium text-black mt-1">
                      {product.price}
                    </p>
                    <span
                      className={`text-[13px] font-medium block mt-1 ${
                        product.available ? "text-[#C6E700]" : "text-[#AF052A]"
                      }`}
                    >
                      {product.available ? "DISPONÍVEL" : "INDISPONÍVEL"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[36px] font-medium text-black">Lojas</h2>
              {editProfileButton ? (
                <button
                  className="w-[38.27px] h-[38.27px] bg-purple-600 text-white rounded-full flex items-center justify-center hover:scale-102 transition"
                  onClick={() => console.log("+")}
                >
                  <Plus />
                </button>
              ) : (
                <button className="text-[16px] font-medium text-[#6A38F3] hover:underline">
                  ver mais
                </button>
              )}
            </div>
            <div className="w-full max-w-[606px] h-[186px] bg-white rounded-[23px] p-8 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="text-[55px] font-light leading-[51px] text-black">
                  Rare Beauty
                </h3>
                <span className="text-[44px] font-normal text-[#6A38F3] leading-[41px]">
                  beleza
                </span>
              </div>
              <div className="w-[120px] h-[120px] rounded-full bg-gray-200 overflow-hidden"></div>
            </div>
          </section>

          <section className="max-w-[930px]">
            <h2 className="text-[36px] font-medium text-black mb-6">
              Avaliações
            </h2>
            <div className="w-full bg-white rounded-[31px] p-8 flex flex-col md:flex-row gap-6 shadow-sm relative">
              <div className="w-[120px] h-[120px] rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                <Image
                  src={nonProfile}
                  alt="Avaliador"
                  width={120}
                  height={120}
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className="text-[28px] font-normal text-black">
                    Selena Gomez
                  </h4>
                  <div className="flex bg-slate-50 p-2 rounded-md gap-1 text-[#FFEB3A] items-center">
                    {productStars(3.8)}
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
      {openModal ? <EditarPerfil onClose={() => setOpenModal(false)} userData={ userData }/> : null
        // alterei essa função para garantir que o modal não feche assim que a página carregar, apenas quando clicar em fechar
        }
    </div>

  );
}
