import { getOneProduct } from "@/app/services/api";
import Navbar from "@/components/navbar";
import ProductStars from "@/components/productStart";
import { Star } from "lucide-react";
import ProductImages from "../ProductImages";
import OwnerActions from "@/components/ownerActions";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const data = await getOneProduct(id);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3E4] text-black">
        <h1 className="text-3xl font-bold">Produto não encontrado</h1>
      </div>
    );
  }

  const relatedProducts = [
    { id: "1", name: "Brownie Trad.", price: "R$3,80", available: false },
    { id: "2", name: "Brownie Doce L.", price: "R$4,70", available: true },
    { id: "3", name: "Brownie Nozes", price: "R$4,70", available: true },
    { id: "4", name: "Brownie Cookies", price: "R$4,70", available: false },
    { id: "5", name: "Brownie M&M's", price: "R$4,70", available: true },
    { id: "6", name: "Redbull Zero", price: "R$5,41", available: true },
    { id: "7", name: "Redbull Melanc.", price: "R$5,41", available: false },
    { id: "8", name: "Redbull", price: "R$5,41", available: true },
  ];

  const reviews = [
    {
      id: 1,
      name: "Selena Gomez",
      text: "Não é por nada não, mas essa garota arrasa",
      rating: 5,
    },
    {
      id: 2,
      name: "Sofia Figueiredo",
      text: "Adorei o produto. Funcionou muito na minha pele. Estou muito contente e com toda certeza irei comprar mais produtos da marca. Que orgulhoooooooo! Arrasaram",
      rating: 5,
    },
    {
      id: 3,
      name: "Pedro Freitas",
      text: "Não consigo descrever a sensação de passar uma base que realmente orna com sua pele... Sensacional! Parabéns aos envolvidos",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen text-black w-full bg-[#F6F3E4] font-['League_Spartan'] pb-24 overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-8 lg:px-[172px] mt-16 flex flex-col lg:flex-row gap-[172px]">
        <ProductImages imagens={data.imagens} nome={data.nome} />

        <div className="flex flex-col w-full lg:w-[418px] relative">
          <div className="flex justify-between items-center gap-2 w-full">
            <h1 className="font-normal text-[40px] leading-[37px] text-black w-[362px]">
              {data.nome}
            </h1>

            <OwnerActions productOwnerId={data.usuarioId} produtoData={data} />
            <button
              className="w-[27px] h-[27px] bg-[#f00000] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              title="Destacar Produto"
            >
              <Star
                size={16}
                fill="#FFFFFF"
                color="#FFFFFF"
                strokeWidth={1.5}
              />
            </button>
          </div>

          <div className="flex items-center gap-[28px] mt-6 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <div className="w-[17px] h-[17px] rounded-[0.5px] flex items-center justify-center">
                <Star fill="#FFEB3A" stroke="#000000" strokeWidth={0.5} />
              </div>
              <span className="font-light text-[18px] text-black">
                4.5 | 15 reviews
              </span>
            </div>
            <span className="font-light text-[18px] leading-[17px] text-[#6A38F3]">
              {data.categoria?.nome || "mercado"}
            </span>
            <span className="font-light text-[18px] leading-[17px] text-[#6A38F3]">
              {data.estoque} disponíveis
            </span>
          </div>

          <h2 className="font-normal text-[40px] leading-[38px] mt-[15px]">
            R$ {Number(data.preco).toFixed(2).replace(".", ",")}
          </h2>

          <div className="mt-[29px]">
            <h3 className="font-normal text-[21px] leading-[19px]">
              Descrição
            </h3>
            <div className="w-[19px] h-[3px] bg-[#C7C7C7] rounded-[4px] mt-[3px] mb-[9px]"></div>

            <p className="font-light text-[13px] leading-[14px] text-black whitespace-pre-wrap text-justify">
              {data.descricao}
            </p>
          </div>
        </div>
      </main>

      <section className="max-w-[1440px] mx-auto mt-[120px] px-8 lg:px-[123px]">
        <h2 className="font-normal text-[40px] leading-[37px] mb-8">
          Avaliações
        </h2>

        <div className="flex overflow-x-auto gap-[30px] pb-6 scrollbar-none">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-[930px] h-[205px] bg-white rounded-[31px] flex relative p-6 items-center flex-shrink-0"
            >
              <div className="w-[154px] h-[154px] bg-[#D9D9D9] rounded-full flex-shrink-0 ml-[6px]"></div>

              <div className="ml-[18px] flex flex-col h-full w-[698px] pt-[13px]">
                <h3 className="font-normal text-[28px] leading-[26px] mb-4">
                  {review.name}
                </h3>
                <p className="font-light text-[24px] leading-[23px] text-justify">
                  {review.text}
                </p>
              </div>

              <div className="absolute top-[35px] right-[29px]">
                <ProductStars rating={review.rating} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto mt-[86px] px-8 lg:px-[123px]">
        <h2 className="font-normal text-[40px] leading-[37px] mb-[40px]">
          Da mesma loja
        </h2>

        <div className="flex overflow-x-auto gap-[32px] pb-8 scrollbar-none">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[228px] h-[310px] bg-white rounded-[35px] relative p-5 flex flex-col flex-shrink-0"
            >
              <div className="absolute top-[16px] right-[16px] w-[68px] h-[68px] bg-gray-200 rounded-full z-10"></div>
              <div className="w-[179px] h-[179px] bg-gray-100 rounded-[12px] mx-auto mt-[6px]"></div>

              <div className="mt-auto pl-[2px] pb-[5px]">
                <h3 className="font-medium text-[26px] leading-[25px] truncate">
                  {product.name}
                </h3>
                <p className="font-medium text-[23px] leading-[21px] mt-[8px]">
                  {product.price}
                </p>
                <span
                  className={`font-medium text-[13px] leading-[13px] mt-[8px] block ${
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
    </div>
  );
}
