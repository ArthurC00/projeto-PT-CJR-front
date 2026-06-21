"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { getCategoriasRaiz } from "../services/api";
import type { Categoria, Produto } from "../services/api";
import { getProdutos } from "../services/productApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllLojas } from "../services/lojaApi";
import type { LojaUsuarioResponse } from "../types/lojaTypes";

export default function FeedPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [lojas, setLojas] = useState<LojaUsuarioResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categoriaIndex, setCategoriaIndex] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [lojaIndex, setLojaIndex] = useState(0);

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods, stores] = await Promise.all([
          getCategoriasRaiz(),
          getProdutos(),
          getAllLojas(),
        ]);
        setCategorias(cats || []);
        setProdutos(prods || []);
        setLojas(stores || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm]);

  const handleNextCategoria = () => {
    const maxIndex = Math.max(0, categorias.length - 6);
    if (categoriaIndex < maxIndex) {
      setCategoriaIndex((prev) => prev + 1);
    }
  };

  const handlePrevCategoria = () => {
    if (categoriaIndex > 0) {
      setCategoriaIndex((prev) => prev - 1);
    }
  };

  const handleNextLoja = () => {
    const maxIndex = Math.max(0, lojas.length - 5);
    if (lojaIndex < maxIndex) {
      setLojaIndex((prev) => prev + 5);
    }
  };

  const handlePrevLoja = () => {
    if (lojaIndex > 0) {
      setLojaIndex((prev) => prev - 5);
    }
  };

  const filteredProducts = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((produto as any).descricao &&
        (produto as any).descricao
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  const visibleCategorias = categorias.slice(
    categoriaIndex,
    categoriaIndex + 10,
  );

  const visibleLojas = lojas.slice(lojaIndex, lojaIndex + 5);

  const totalPaginas = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (paginaAtual - 1) * itemsPerPage,
    paginaAtual * itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3E4] text-black">
        <h1 className="text-3xl font-bold animate-pulse">Carregando feed...</h1>
      </div>
    );
  }

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
          unoptimized
        />
        <div className="font-sans max-h-10 max-w-12xl justify-center relative left-100 bottom-60">
          <p className="text-white text-6xl">do CAOS à organização,</p>
          <p className="text-white text-5xl relative left-22">
            em apenas alguns cliques
          </p>
        </div>
      </div>

      <div className="justify-items-between justify-center">
        <input
          type="search"
          placeholder="procure aqui"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="relative h-10 mt-5 ml-300 bg-white w-150 px-4 rounded-full py-2 text-gray-700 focus:outline-none"
        />
      </div>

      {categorias.length > 0 ? (
        <div className="justify-around">
          <div className="flex justify-between w-full items-center mr-20 relative top-15">
            <h1 className="text-black text-4xl font-bold ml-40 tracking-wider">
              Categorias
            </h1>
            {categorias.length > 10 && (
              <div className="flex gap-2 px-30">
                <button
                  onClick={handlePrevCategoria}
                  disabled={categoriaIndex === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border border-black/10 transition-all ${
                    categoriaIndex === 0
                      ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                      : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={handleNextCategoria}
                  disabled={categoriaIndex >= categorias.length - 10}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border border-black/10 transition-all ${
                    categoriaIndex >= categorias.length - 10
                      ? "opacity-30 cursor-not-allowed bg-white/50 text-black/40"
                      : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-4 overflow-auto mt-22 px-40">
            {visibleCategorias.map((categoria: Categoria) => (
              <a
                key={categoria.id}
                href={`/feed/categorias/${categoria.id}`}
                className="px-5 py-2 rounded-full bg-white text-blue-600 text-2xl hover:bg-gray-300 whitespace-nowrap"
              >
                {categoria.nome}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          Nenhuma categoria encontrada.
        </p>
      )}

      <div>
        <h1 className="text-black text-4xl font-bold ml-40 relative top-15 tracking-wider">
          Produtos
        </h1>

        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-5 gap-2 px-30 mt-20 ml-20">
            {paginatedProducts.map((produto: Produto) => (
              <Link key={produto.id} href={`/produto/${produto.id}`}>
                <div className="flex flex-col rounded-4xl object-cover bg-gray-100 w-70 h-90 justify-center items-center hover:bg-gray-200">
                  {produto.imagens && produto.imagens.length > 0 ? (
                    <div className="">
                      <img
                        src={produto.imagens[0].url_imagem}
                        alt={produto.nome}
                        className="object-contain max-w-50 max-h-50 rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div className="w-50 h-50 bg-gray-100 flex items-center justify-center mb-10 rounded-2xl mt-10">
                      <p className="text-gray-400 text-sm">sem imagem</p>
                    </div>
                  )}
                  <div className="mt-5">
                    <p className="flex text-3xl text-black justify-center ">
                      {produto.nome}
                    </p>
                    <p className="flex text-blue-600 text-4xl font-bold justify-center">
                      {Number(produto.preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-20 text-xl w-full">
            Nenhum produto correspondente encontrado.
          </p>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-6 mt-12 mb-12 select-none">
            <button
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="disabled:opacity-30 disabled:cursor-not-allowed text-black hover:scale-110 transition-transform p-2 border-2 border-transparent hover:border-black/20 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-4">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPaginaAtual(num)}
                    className={`font-sans text-4xl transition-all ${
                      paginaAtual === num
                        ? "text-black font-semibold scale-110"
                        : "text-black/50 font-normal hover:text-black"
                    }`}
                  >
                    {num}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() =>
                setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
              }
              disabled={paginaAtual === totalPaginas}
              className="disabled:opacity-30 disabled:cursor-not-allowed text-black hover:scale-110 transition-transform p-2 border-2 border-transparent hover:border-black/20 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {lojas.length > 0 && (
        <div className="bg-black py-16 w-full mt-16">
          <div className="flex justify-between items-center mb-8 ml-40 pr-40">
            <h1 className="text-white text-4xl font-bold tracking-wider">
              Lojas Parceiras
            </h1>
            {lojas.length > 5 && (
              <div className="flex gap-2">
                <button
                  onClick={handlePrevLoja}
                  disabled={lojaIndex === 0}
                  className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border border-white/10 transition-all ${
                    lojaIndex === 0
                      ? "opacity-30 cursor-not-allowed bg-white/20 text-white/40"
                      : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextLoja}
                  disabled={lojaIndex >= lojas.length - 5}
                  className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border border-white/10 transition-all ${
                    lojaIndex >= lojas.length - 5
                      ? "opacity-30 cursor-not-allowed bg-white/20 text-white/40"
                      : "bg-white text-black hover:bg-purple-600 hover:text-white cursor-pointer active:scale-95 shadow-sm"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 py-4 ml-40 pr-40 justify-items-center">
            {visibleLojas.map((loja) => (
              <Link
                key={loja.id}
                href={`/loja/${loja.id}`}
                className="flex flex-col items-center gap-3 flex-none group"
              >
                <div className="w-24 h-24 rounded-full bg-white border border-white/10 overflow-hidden relative shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                  {loja.logo_url ? (
                    <Image
                      src={loja.logo_url}
                      alt={loja.nome}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#6A38F3] text-white font-bold text-2xl">
                      {loja.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-white text-lg font-medium group-hover:text-purple-400 transition-colors truncate max-w-28 text-center">
                  {loja.nome}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
