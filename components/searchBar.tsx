import { useState, useCallback, useEffect } from 'react'; 

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
      fetch(`http://localhost:3001/produtos?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
} 


export function BarraDePesquisa() {
    const [ input, setInput ] = useState('');
    const { results, loading } = useProductSearch(input);

    return (
     <div className="justify-items-between justify-center relative">
        <input
          type="search"
          placeholder="procure aqui"
          value = { input }
          onChange={(e) => setInput(e.target.value)}
          className=" relative h-10 mt-5 ml-300 bg-white  w-150 px-4 rounded-full py-2 text-gray-700 focus:outline-none"
        />
        {(loading || results.length > 0) && (
            <ul className ="absolute bg-white border border-gray-200 rounded-xl shadow-lg mt-1 w-150 ml-300 z-50">
                {loading && (
                    <li className="px-4 py-2 text-gray-400 text-sm">Buscando...</li>
                )}
                {results.map((produto) => (
                     <li
              key={produto.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
              onClick={() => {
                setInput(produto.nome);
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