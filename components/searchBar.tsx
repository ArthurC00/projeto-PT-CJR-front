import { useState, useCallback, useEffect } from "react";
import { api } from "@/app/services/api";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  estoque: number;
}

export function useProductSearch(query: string) {
  const [results, setResults] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api.get(`/produtos?q=${encodeURIComponent(query)}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error("Search error:", err))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}

export function BarraDePesquisa() {
  const [input, setInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controla se a lista deve aparecer

  const { results, loading } = useProductSearch(input);

  useEffect(() => {
    if (!input.trim()) setIsDropdownOpen(false);
    else setIsDropdownOpen(true);
  }, [input]);

  return (
    <div className="flex justify-center relative w-full max-w-[600px] mx-auto mt-5">
      <input
        type="search"
        placeholder="Procure aqui..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-10 bg-white w-full px-4 rounded-full py-2 text-gray-700 focus:outline-none shadow-sm border border-gray-200"
      />

      {isDropdownOpen && (loading || results.length > 0) && (
        <ul className="absolute top-12 bg-white border border-gray-200 rounded-xl shadow-lg w-full z-50 overflow-hidden">
          {loading && (
            <li className="px-4 py-2 text-gray-400 text-sm italic">
              Buscando...
            </li>
          )}

          {!loading &&
            results.map((produto) => (
              <li
                key={produto.id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm border-b border-gray-50 last:border-0"
                onClick={() => {
                  setInput(produto.nome);
                  setIsDropdownOpen(false);
                }}
              >
                {produto.nome}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
