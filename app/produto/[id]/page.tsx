"use client";

import { useState, useEffect, use } from "react";
import {
  getOneProduct,
  getProductsReviewByProductId,
} from "@/app/services/productApi";
import Navbar from "@/components/navbar";
import ProductStars from "@/components/productStart";
import { Star } from "lucide-react";
import ProductImages from "../ProductImages";
import OwnerActions from "@/components/ownerActions";
import { getProductByUserId } from "@/app/services/productApi";
import { ProductResponse, ReviewProduct } from "@/app/types/productTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const [countdown, setCountdown] = useState(3);

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
    return () => clearInterval(timer);
  }, [isLoading, productData, countdown, router]);

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

  return (
    <div className="min-h-screen text-black w-full bg-[#F6F3E4] font-['League_Spartan'] pb-24 overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-8 lg:px-[172px] mt-16 flex flex-col lg:flex-row gap-[172px]">
        <ProductImages imagens={productData.imagens} nome={productData.nome} />

        <div className="flex flex-col w-full lg:w-[418px] relative">
          <div className="flex justify-between items-center gap-2 w-full">
            <h1 className="font-normal text-[40px] leading-[37px] text-black w-[362px]">
              {productData.nome}
            </h1>

            <OwnerActions
              productOwnerId={productData.loja.usuario_id}
              produtoData={productData}
              onClick={() => fetchPageData()}
            />
          </div>

          <div className="flex items-center gap-[28px] mt-6 whitespace-nowrap">
            {productData.avaliacoes.length > 0 ? (
              <div className="flex items-center gap-1">
                <div className="w-[17px] h-[17px] rounded-[0.5px] -mt-1 flex items-center justify-center">
                  <Star fill="#FFEB3A" stroke="#000000" strokeWidth={0.5} />
                </div>
                <span className="flex gap-1 font-light text-[18px] text-black">
                  <p>{`${0} | ` || ""}</p>
                  <p> {productData.avaliacoes.length}</p>
                </span>
              </div>
            ) : (
              <p>Ainda não avaliado</p>
            )}
            <span className="font-light text-[18px] leading-[17px] text-[#6A38F3]">
              {productData.categoria?.nome || ""}
            </span>
            <span className="font-light text-[18px] leading-[17px] text-[#6A38F3]">
              {productData.estoque} disponíveis
            </span>
          </div>

          <h2 className="font-normal text-[40px] leading-[38px] mt-[15px]">
            R$ {Number(productData.preco).toFixed(2).replace(".", ",")}
          </h2>

          <div className="mt-[29px]">
            <h3 className="font-normal text-[21px] leading-[19px]">
              Descrição
            </h3>
            <div className="w-[19px] h-[3px] bg-[#C7C7C7] rounded-[4px] mt-[3px] mb-[9px]"></div>

            <p className="font-light text-[13px] leading-[14px] text-black whitespace-pre-wrap text-justify">
              {productData.descricao}
            </p>
          </div>
        </div>
      </main>

      <section className="max-w-[1440px] mx-auto mt-16 md:mt-[120px] px-4 md:px-8 lg:px-[123px]">
        <h2 className="font-normal text-3xl md:text-[40px] md:leading-[37px] mb-6 md:mb-8">
          Avaliações
        </h2>

        {reviews ? (
          <div className="flex overflow-x-auto gap-[15px] md:gap-[30px] pb-6 scrollbar-none snap-x snap-mandatory">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 snap-start w-[85vw] md:w-[calc(50%-15px)] bg-white rounded-[24px] md:rounded-[31px] flex relative p-5 md:p-6 items-start md:items-center min-h-[180px]"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 bg-[#D9D9D9] rounded-full flex-shrink-0 mt-2 md:mt-0">
                  {review.usuario.foto_perfil_url ? (
                    <Image
                      src={review.usuario.foto_perfil_url}
                      alt="Logo da loja"
                      width={48}
                      height={48}
                      className="w-full rounded-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="ml-4 md:ml-[18px] flex flex-col flex-1">
                  <h3 className="font-medium text-lg md:text-[22px] leading-tight mb-2 pr-20">
                    {review.usuario.nome}
                  </h3>

                  <p className="font-light text-sm md:text-base text-justify text-gray-700 line-clamp-4">
                    {review.comentario}
                  </p>
                </div>

                <div className="absolute top-5 right-5 md:top-6 md:right-6 scale-75 md:scale-100 origin-top-right">
                  <ProductStars rating={review.nota} />
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

      <section className="max-w-[1440px] mx-auto mt-[86px] px-8 lg:px-[123px]">
        <h2 className="font-normal text-[40px] leading-[37px] mb-[40px]">
          Da mesma loja
        </h2>

        {relatedProducts.length > 0 ? (
          <div className="flex overflow-x-auto gap-[32px] pb-8 scrollbar-none">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[228px] h-[310px] bg-white rounded-[35px] relative p-5 flex flex-col flex-shrink-0"
                onClick={() => {
                  router.push(`/produto/${product.id}`);
                }}
              >
                <div className="absolute top-[16px] right-[16px] w-[68px] h-[68px] bg-gray-200 rounded-full z-10 overflow-hidden">
                  {product.loja.banner_url ? (
                    <Image
                      src={product.loja.banner_url}
                      alt="Logo da loja"
                      width={68}
                      height={68}
                      className="w-full h-full object-cover"
                    />
                  ) : null}{" "}
                </div>
                <div className="w-[179px] h-[179px] bg-gray-100 rounded-[12px] mx-auto mt-[6px]"></div>

                <div className="mt-auto pl-[2px] pb-[5px]">
                  <h3 className="font-medium text-[26px] leading-[25px] truncate">
                    {product.nome}
                  </h3>
                  <p className="font-medium text-[23px] leading-[21px] mt-[8px]">
                    {product.preco}
                  </p>
                  <span
                    className={`font-medium text-[13px] leading-[13px] mt-[8px] block ${
                      product.estoque > 0 ? "text-[#C6E700]" : "text-[#AF052A]"
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
    </div>
  );
}
