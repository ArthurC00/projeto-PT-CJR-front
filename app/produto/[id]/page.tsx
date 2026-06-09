import { getOneProduct } from "@/app/services/api";
import Navbar from "@/components/navbar";
import ProductStars from "@/components/productStart";
import { Star } from "lucide-react";
import ProductImages from "../ProductImages";

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
    { id: "6", name: "Redbull Zero", price: "R$5,41", available: true },
  ];

  const reviews = [
    {
      id: 1,
      name: "Selena Gomez",
      text: "Não é por nada não, mas essa garota arrasa",
      rating: 5,
    },
  ];

  //   console.log(data);

  return (
    <div className="min-h-screen text-black w-full bg-[#F6F3E4] font-['League_Spartan'] pb-24 overflow-x-hidden">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-8 lg:px-[172px] mt-16 flex flex-col lg:flex-row gap-16">
        <ProductImages imagens={data.imagens} nome={data.nome} />

        <div className="flex flex-col pt-2 w-[418px]">
          <h1 className="font-normal text-[40px] leading-[37px] text-black">
            {data.nome}
          </h1>

          <div className="flex items-center gap-4 mt-6 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Star fill="#FFEB3A" stroke="#000000" strokeWidth={0.5} />
              <span className="font-light text-[18px] text-black">
                4.5 | 15 avaliações
              </span>
            </div>
            <span className="font-light text-[18px] text-[#6A38F3]">
              Categoria: {data.categoria.nome || "Sem Categoria"}
            </span>
            <span className="font-light text-[18px] text-[#6A38F3]">
              {data.estoque} disponíveis
            </span>
          </div>

          <h2 className="font-normal text-[40px] mt-6">
            R$ {Number(data.preco).toFixed(2).replace(".", ",")}
          </h2>

          <div className="mt-10">
            <h3 className="font-normal text-[21px]">Descrição</h3>
            <div className="w-[19px] h-[3px] bg-[#C7C7C7] rounded mt-1 mb-4"></div>

            <p className="font-light text-[13px] leading-[14px] text-black whitespace-pre-wrap">
              {data.descricao}
            </p>
          </div>
        </div>
      </main>

      <section className="max-w-[1440px] mx-auto mt-24 px-8 lg:px-[123px]">
        <h2 className="font-normal text-[40px] mb-8">Avaliações</h2>

        <div className="flex overflow-x-auto gap-[30px] pb-6 scrollbar-none">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-[930px] h-[205px] bg-white rounded-[31px] flex relative p-6 items-center shadow-sm"
            >
              <div className="w-[154px] h-[154px] bg-gray-300 rounded-full flex-shrink-0 ml-2"></div>
              <div className="ml-6 flex flex-col h-full justify-center w-[698px]">
                <h3 className="font-normal text-[28px] mb-2">{review.name}</h3>
                <p className="font-light text-[24px] leading-[26px] text-justify">
                  {review.text}
                </p>
              </div>
              <ProductStars rating={review.rating} />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto mt-16 px-8 lg:px-[123px]">
        <h2 className="font-normal text-[40px] mb-8">Da mesma loja</h2>

        <div className="flex overflow-x-auto gap-8 pb-8 scrollbar-none">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[228px] h-[310px] bg-white rounded-[35px] relative p-5 flex flex-col justify-end shadow-sm"
            >
              <div className="absolute top-4 right-4 w-[68px] h-[68px] bg-gray-200 rounded-full z-10"></div>
              <div className="absolute top-4 left-4 right-4 h-[160px] bg-gray-100 rounded-[12px]"></div>
              <div className="mt-auto">
                <h3 className="font-medium text-[26px] leading-[25px] truncate">
                  {product.name}
                </h3>
                <p className="font-medium text-[23px] mt-2">{product.price}</p>
                <span
                  className={`font-medium text-[13px] mt-2 block ${product.available ? "text-[#C6E700]" : "text-[#AF052A]"}`}
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
