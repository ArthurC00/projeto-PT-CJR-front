import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { getCategoriaComProdutos } from "@/app/services/api"
import type { CategoriaDetalhe } from "@/app/services/api"

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const { id } = await params
  console.log('id da página:', id)

  const categoria: CategoriaDetalhe = await getCategoriaComProdutos(id)

  // pega o id da subcategoria selecionada da URL (para filtrar)
  
  return (
    <div className="min-h-screen min-w-screen overflow-x-hidden">
      {/* banner */}
      <div className="object-cover min-w-screen min-h-95 max-h-112 bg-black justify-self-start">
        <Navbar />
        <Image
          className="ml-300 justify-baseline bottom-0.5"
          src="/MascoteMasculino.png"
          alt="mascote com celular"
          width={280}
          height={500}
        />
        <div className="font-sans max-h-10 max-w-12xl justify-center relative left-100 bottom-60">
          <p className="text-white text-6xl">{categoria.nome},</p>
          <p className="text-white text-5xl">
            em um só lugar
          </p>
        </div>
      </div>

      {/* barra de pesquisa */}
      <div className="justify-items-between justify-center">
        <input
          type="search"
          placeholder="procure aqui"
          className="relative h-10 mt-5 ml-300 bg-white w-150 px-4 rounded-full py-2 text-gray-700 focus:outline-none"
        />
      </div>

      {/* subcategorias + ordenar */}
      <div className="grid grid-cols-2 gap-0.1 mt-5 ml-16">
        <div className=" flex flex-wrap gap-3 mt-5">
          {/* link "Todos" para mostrar todos os produtos */}
          <Link
            href={`/feed/categorias/${categoria.categoria_pai_id ?? categoria.id}`}
            className="bg-white px-5 py-2 rounded-full text-2xl text-blue-400 hover:bg-blue-50 transition-colors"
          >
            Todos
          </Link>

          {/* subcategorias */}
          {categoria.tipos.map((sub) => (
            <Link
              key={sub.id}
              href={`/feed/categorias/${sub.id}`}
              className="bg-white px-5 py-2 rounded-full text-2xl text-blue-400 hover:bg-blue-50 transition-colors"
            >
              {sub.nome}
            </Link>
          ))}
        </div>

      </div>

      {/* produtos */}
      <div>
        {categoria.todosOsProdutos.length > 0 ? (
          <div className="justify-center grid grid-cols-5 gap-2 mt-10 ml-20">
            {categoria.todosOsProdutos.map((produto) => (
              <Link key={produto.id} href={`/produto/${produto.id}`}>
                <div className="flex flex-col rounded-4xl bg-gray-100 w-70 h-90 justify-center items-center hover:bg-gray-200">
                  {produto.imagens && produto.imagens.length > 0 ? (
                    <div className="">
                      <img
                        src={produto.imagens[0].url_imagem}
                        alt={produto.nome}
                        className="flex max-w-50 max-h-50 object-contain rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="w-50 h-50 bg-gray-100 flex items-center justify-center rounded-2xl">
                        <p className="text-gray-400 text-sm ">sem imagem</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-5">
                    <p className="flex text-black text-3xl justify-center">{produto.nome}</p>
                    <p className="flex text-blue-600 font-bold text-4xl justify-center">
                      {Number(produto.preco).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-500">
            Nenhum produto nessa categoria ainda.
          </p>
        )}
      </div>
    </div>
  )
}