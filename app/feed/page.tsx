import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { getCategorias, getProdutos, getCategoriasRaiz } from "../services/api";
import type { Categoria, Produto } from "../services/api";

export default async function FeedPage() {
  const categorias: Categoria[] = await getCategoriasRaiz()
  const produtos: Produto[] = await getProdutos()

  return (
    <div className="min-h-screen min-w-screen max-h-screen overflow-x-hidden">
      <div className="object-cover min-w-screen min-h-95 max-h-112 bg-black justify-self-start">
        <Navbar />
        <Image
          className="ml-300 justify-baseline bottom-0.5"
          src="/girlBox.png"
          alt="mascote com caixas"
          width={450}
          height={600}
        />
        <div className="font-sans max-h-10 max-w-12xl justify-center relative left-100 bottom-60">
          <p className="text-white text-6xl">do CAOS à organização,</p>
          <p className="text-white text-5xl relative left-22">
            em apenas alguns cliques
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

      {/* categorias */}
      {categorias.length > 0 ? (
        <div className="justify-items-center justify-around">
          <h1 className="text-black text-4xl font-bold ml-40 relative top-15 tracking-wider">
            Categorias
          </h1>
          <div className="flex gap-4 overflow-auto mt-22 ml-30">
            {categorias.map((categoria: Categoria) => (
              <a key={categoria.id} href={`/feed/categoriasDeslogado/${categoria.id}`}
                  className="px-5 py-2 rounded-full bg-white text-blue-600 text-2xl hover:bg-gray-300">
                {categoria.nome}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p>Nenhuma categoria encontrada.</p>
      )}

      {/* produtos */}
      <div>
        <h1 className="text-black text-4xl font-bold ml-40 relative top-15 tracking-wider">
          Produtos{" "}
          <Link
            className="text-xl text-blue-500 hover:text-blue-900"
            href={"/melhoresAvaliados"}
          >
            melhores avaliados
          </Link>
        </h1>

        {produtos.length > 0 ? (
          <div className="grid grid-cols-5 gap-2 mt-20 ml-10">
            {produtos.map((produto: Produto) => (
              <Link key={produto.id} href={`/produto/${produto.id}`}> 
                <div className="border rounded p-2">
                  {produto.imagens && produto.imagens.length > 0 ? (
                    <div>
                    <img
                      src={produto.imagens[0].url_imagem}
                      alt={produto.nome}
                      className="w-full object-cover rounded"
                    />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-400 text-sm">sem imagem</p>
                    </div>
                  )}
                  <p className="text-3xl text-black justify-center">{produto.nome}</p>
                  <p className="text-blue-600 text-4xl font-bold">
                    {Number(produto.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
